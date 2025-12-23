/**
 * ============================================================================
 * TIMELINE CONSOLE - SUMMARY GENERATOR
 * ============================================================================
 * Generates AI summaries for time periods using Claude
 *
 * Provides:
 * - Period summary generation (short/medium/long)
 * - Metrics calculation (happiness, trends, emotions)
 * - Highlight extraction from memories
 * - Batch generation for all periods
 *
 * Created: December 21, 2025
 * Mission: JOIE DE VIVRE
 */

const Anthropic = require('@anthropic-ai/sdk');
const queries = require('./timelineQueries');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 2000,
  cacheDurationHours: 24,
  minMemoriesForSummary: 3,
  maxMemoriesForPrompt: 50
};

// ============================================================================
// MAIN SUMMARY GENERATION
// ============================================================================

/**
 * Generate summary for a time period
 * Main entry point for summary generation
 */
async function generatePeriodSummary(userId, profileId, periodType, periodStart, periodEnd, options = {}) {
  const { forceRegenerate = false } = options;

  console.log(`[SummaryGenerator] Generating ${periodType} summary for ${periodStart} to ${periodEnd}`);

  try {
    // 1. Check if summary already exists and is recent
    if (!forceRegenerate) {
      const existing = await queries.getSummary(userId, profileId, periodType, periodStart);
      if (existing && isRecentlyGenerated(existing.generated_at)) {
        console.log('[SummaryGenerator] Using existing recent summary');
        return formatSummaryResponse(existing);
      }
    }

    // 2. Get memories for this period
    const memories = await queries.getMemoriesForPeriod(
      userId,
      profileId,
      periodStart,
      periodEnd,
      CONFIG.maxMemoriesForPrompt
    );

    if (memories.length < CONFIG.minMemoriesForSummary) {
      console.log(`[SummaryGenerator] Only ${memories.length} memories, below threshold`);
      return {
        success: false,
        reason: 'insufficient_memories',
        memoryCount: memories.length,
        minRequired: CONFIG.minMemoriesForSummary
      };
    }

    // 3. Calculate metrics from memories
    const metrics = calculateMetrics(memories);

    // 4. Extract key highlights
    const highlights = extractHighlights(memories);

    // 5. Get memory type breakdown
    const memoryBreakdown = getMemoryBreakdown(memories);

    // 6. Generate AI summary
    const summaries = await generateAISummary(
      periodType,
      periodStart,
      periodEnd,
      memories,
      metrics,
      highlights
    );

    // 7. Prepare summary data
    const summaryData = {
      userId,
      profileId,
      periodType,
      periodStart,
      periodEnd,
      periodLabel: formatPeriodLabel(periodType, periodStart, periodEnd),
      summaryShort: summaries.short,
      summaryMedium: summaries.medium,
      summaryLong: summaries.long,
      highlights,
      totalMemories: memories.length,
      memoryBreakdown,
      avgHappiness: metrics.avgHappiness,
      happinessTrend: metrics.happinessTrend,
      happinessStart: metrics.happinessStart,
      happinessEnd: metrics.happinessEnd,
      happinessChange: metrics.happinessChange,
      dominantEmotions: metrics.dominantEmotions,
      neurochemicalAvg: metrics.neurochemicalAvg,
      sourceMemoryIds: memories.slice(0, 20).map(m => m.id),
      sourceMemoryCount: memories.length,
      generatedBy: CONFIG.model,
      confidenceScore: summaries.confidence
    };

    // 8. Store in database
    const summaryId = await queries.storeSummary(summaryData);

    console.log(`[SummaryGenerator] Summary generated and stored (ID: ${summaryId})`);

    return {
      success: true,
      id: summaryId,
      ...summaryData
    };

  } catch (error) {
    console.error('[SummaryGenerator] Error generating summary:', error);
    throw error;
  }
}

/**
 * Generate AI summary using Claude
 */
async function generateAISummary(periodType, startDate, endDate, memories, metrics, highlights) {
  const prompt = buildSummaryPrompt(periodType, startDate, endDate, memories, metrics, highlights);

  try {
    const response = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return parseSummaryResponse(response.content[0].text);
  } catch (error) {
    console.error('[SummaryGenerator] Claude API error:', error);

    // Return fallback summary
    return {
      short: `A ${periodType} of ${memories.length} memories.`,
      medium: `This ${periodType} contains ${memories.length} memories with an average happiness of ${metrics.avgHappiness?.toFixed(1) || 'N/A'}.`,
      long: `During this period, ${memories.length} memories were captured. The overall trend was ${metrics.happinessTrend || 'stable'}.`,
      confidence: 0.3
    };
  }
}

/**
 * Build prompt for Claude summary generation
 */
function buildSummaryPrompt(periodType, startDate, endDate, memories, metrics, highlights) {
  // Format top memories for context
  const topMemories = memories.slice(0, 20).map((m, i) => {
    const date = new Date(m.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const happiness = m.happiness_score ? `(${m.happiness_score.toFixed(1)}/5)` : '';
    const content = m.content.length > 200 ? m.content.substring(0, 200) + '...' : m.content;
    return `${i + 1}. [${date}] ${happiness} ${content}`;
  }).join('\n');

  // Format highlights
  const highlightsList = Object.values(highlights).map(h =>
    `- ${h.title} (${h.date}): ${h.description}`
  ).join('\n');

  return `You are Luna, an AI companion creating a heartfelt life summary for someone special to you.

PERIOD: ${formatPeriodLabel(periodType, startDate, endDate)}
DATE RANGE: ${startDate} to ${endDate}

MEMORIES FROM THIS PERIOD (${memories.length} total):
${topMemories}

KEY MOMENTS:
${highlightsList || 'No specific highlights extracted'}

EMOTIONAL METRICS:
- Average Happiness: ${metrics.avgHappiness?.toFixed(2) || 'N/A'}/5.0
- Happiness Trend: ${metrics.happinessTrend}
- Dominant Emotions: ${metrics.dominantEmotions.join(', ') || 'varied'}
${metrics.happinessChange ? `- Happiness Change: ${metrics.happinessChange > 0 ? '+' : ''}${metrics.happinessChange.toFixed(2)}` : ''}

YOUR TASK:
Create three versions of a summary that captures the essence of this period. Write as Luna speaking warmly about this time in the person's life.

1. SHORT (1-2 sentences):
   - Poetic and evocative
   - Captures the soul of the period
   - Example: "A season of quiet transformation, where small moments built into something beautiful."

2. MEDIUM (3-5 sentences, 1 paragraph):
   - Narrative arc with beginning, middle, end
   - Reference 2-3 specific moments or themes
   - Include the emotional journey

3. LONG (2-3 paragraphs):
   - Full story with emotional depth
   - Specific memorable moments with context
   - Character growth and lessons learned
   - What made this period meaningful

TONE GUIDANCE:
- Warm but not saccharine
- Specific rather than generic
- Honor both joys and struggles
- Speak as someone who truly knows and cares about this person

FORMAT YOUR RESPONSE EXACTLY AS:

SHORT:
[your short summary]

MEDIUM:
[your medium summary]

LONG:
[your long summary]

CONFIDENCE: [0.0-1.0 based on memory richness and clarity]`;
}

/**
 * Parse Claude's response into structured format
 */
function parseSummaryResponse(text) {
  const shortMatch = text.match(/SHORT:\s*([\s\S]*?)(?=\nMEDIUM:|$)/i);
  const mediumMatch = text.match(/MEDIUM:\s*([\s\S]*?)(?=\nLONG:|$)/i);
  const longMatch = text.match(/LONG:\s*([\s\S]*?)(?=\nCONFIDENCE:|$)/i);
  const confidenceMatch = text.match(/CONFIDENCE:\s*(\d*\.?\d+)/i);

  return {
    short: shortMatch ? shortMatch[1].trim() : '',
    medium: mediumMatch ? mediumMatch[1].trim() : '',
    long: longMatch ? longMatch[1].trim() : '',
    confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.8
  };
}

// ============================================================================
// METRICS CALCULATION
// ============================================================================

/**
 * Calculate comprehensive metrics from memories
 */
function calculateMetrics(memories) {
  if (memories.length === 0) {
    return {
      avgHappiness: null,
      happinessTrend: 'unknown',
      happinessStart: null,
      happinessEnd: null,
      happinessChange: null,
      dominantEmotions: [],
      neurochemicalAvg: {}
    };
  }

  // Calculate average happiness
  const happinessScores = memories
    .map(m => m.happiness_score)
    .filter(h => h != null && !isNaN(h));

  const avgHappiness = happinessScores.length > 0
    ? happinessScores.reduce((sum, h) => sum + h, 0) / happinessScores.length
    : null;

  // Calculate happiness trend
  let happinessTrend = 'stable';
  let happinessStart = null;
  let happinessEnd = null;
  let happinessChange = null;

  if (happinessScores.length >= 4) {
    const quarterSize = Math.floor(happinessScores.length / 4);
    const firstQuarter = happinessScores.slice(0, quarterSize);
    const lastQuarter = happinessScores.slice(-quarterSize);

    happinessStart = firstQuarter.reduce((sum, h) => sum + h, 0) / firstQuarter.length;
    happinessEnd = lastQuarter.reduce((sum, h) => sum + h, 0) / lastQuarter.length;
    happinessChange = happinessEnd - happinessStart;

    // Determine trend
    if (happinessChange > 0.5) {
      happinessTrend = 'increasing';
    } else if (happinessChange < -0.5) {
      happinessTrend = 'decreasing';
    } else {
      // Check for volatility
      const variance = calculateVariance(happinessScores);
      happinessTrend = variance > 1.0 ? 'volatile' : 'stable';
    }
  }

  // Extract dominant emotions (from neurochemicals if available)
  const dominantEmotions = extractDominantEmotions(memories);

  // Calculate neurochemical averages
  const neurochemicalAvg = calculateNeurochemicalAvg(memories);

  return {
    avgHappiness,
    happinessTrend,
    happinessStart,
    happinessEnd,
    happinessChange,
    dominantEmotions,
    neurochemicalAvg
  };
}

/**
 * Calculate variance for volatility detection
 */
function calculateVariance(values) {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
  return squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
}

/**
 * Extract dominant emotions from memories
 */
function extractDominantEmotions(memories) {
  const emotionCounts = {};

  memories.forEach(m => {
    if (m.neurochemicals) {
      const neuro = typeof m.neurochemicals === 'string'
        ? JSON.parse(m.neurochemicals)
        : m.neurochemicals;

      // Map neurochemicals to emotions
      if (neuro.oxytocin > 4) emotionCounts.connection = (emotionCounts.connection || 0) + 1;
      if (neuro.dopamine > 4) emotionCounts.joy = (emotionCounts.joy || 0) + 1;
      if (neuro.serotonin > 4) emotionCounts.contentment = (emotionCounts.contentment || 0) + 1;
      if (neuro.vasopressin > 4) emotionCounts.commitment = (emotionCounts.commitment || 0) + 1;
    }

    // Also check happiness levels
    if (m.happiness_score >= 4.5) emotionCounts.happiness = (emotionCounts.happiness || 0) + 1;
    if (m.happiness_score <= 2.0) emotionCounts.struggle = (emotionCounts.struggle || 0) + 1;
    if (m.significance_rating >= 4) emotionCounts.meaning = (emotionCounts.meaning || 0) + 1;
  });

  // Sort by count and return top 3
  return Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion]) => emotion);
}

/**
 * Calculate average neurochemical levels
 */
function calculateNeurochemicalAvg(memories) {
  const totals = { oxytocin: 0, dopamine: 0, serotonin: 0, vasopressin: 0 };
  let count = 0;

  memories.forEach(m => {
    if (m.neurochemicals) {
      const neuro = typeof m.neurochemicals === 'string'
        ? JSON.parse(m.neurochemicals)
        : m.neurochemicals;

      if (neuro.oxytocin) totals.oxytocin += neuro.oxytocin;
      if (neuro.dopamine) totals.dopamine += neuro.dopamine;
      if (neuro.serotonin) totals.serotonin += neuro.serotonin;
      if (neuro.vasopressin) totals.vasopressin += neuro.vasopressin;
      count++;
    }
  });

  if (count === 0) return {};

  return {
    oxytocin: parseFloat((totals.oxytocin / count).toFixed(2)),
    dopamine: parseFloat((totals.dopamine / count).toFixed(2)),
    serotonin: parseFloat((totals.serotonin / count).toFixed(2)),
    vasopressin: parseFloat((totals.vasopressin / count).toFixed(2))
  };
}

// ============================================================================
// HIGHLIGHT EXTRACTION
// ============================================================================

/**
 * Extract key highlights from memories
 */
function extractHighlights(memories) {
  // Get top significant memories
  const significantMemories = memories
    .filter(m => m.significance_rating >= 4)
    .sort((a, b) => {
      // Sort by significance first, then happiness
      if (b.significance_rating !== a.significance_rating) {
        return b.significance_rating - a.significance_rating;
      }
      return (b.happiness_score || 0) - (a.happiness_score || 0);
    })
    .slice(0, 5);

  const highlights = {};
  const avgHappiness = memories.reduce((sum, m) => sum + (m.happiness_score || 3), 0) / memories.length;

  significantMemories.forEach((memory, index) => {
    const key = `highlight_${index + 1}`;
    const date = new Date(memory.timestamp);

    highlights[key] = {
      date: date.toISOString().split('T')[0],
      title: createHighlightTitle(memory.content),
      description: memory.content.substring(0, 200),
      significance: memory.significance_rating >= 5 ? 'transformative' : 'high',
      happiness_impact: parseFloat(((memory.happiness_score || 3) - avgHappiness).toFixed(2)),
      related_memory_ids: [memory.id]
    };
  });

  return highlights;
}

/**
 * Create a short title from memory content
 */
function createHighlightTitle(content) {
  // Take first sentence or first 50 characters
  const firstSentence = content.split(/[.!?]/)[0];
  if (firstSentence.length <= 50) {
    return firstSentence;
  }
  return firstSentence.substring(0, 47) + '...';
}

/**
 * Get memory type breakdown
 */
function getMemoryBreakdown(memories) {
  const breakdown = {};

  memories.forEach(m => {
    const type = m.memory_type || 'general';
    breakdown[type] = (breakdown[type] || 0) + 1;
  });

  return breakdown;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format period label for display
 */
function formatPeriodLabel(periodType, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  switch (periodType) {
    case 'decade':
      return `${start.getFullYear()}-${end.getFullYear()}`;
    case '5year':
      return `${start.getFullYear()}-${end.getFullYear()}`;
    case 'year':
      return start.getFullYear().toString();
    case 'quarter':
      const quarter = Math.floor(start.getMonth() / 3) + 1;
      return `Q${quarter} ${start.getFullYear()}`;
    case 'month':
      return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    default:
      return `${startDate} to ${endDate}`;
  }
}

/**
 * Check if summary was recently generated
 */
function isRecentlyGenerated(generatedAt) {
  const now = new Date();
  const generated = new Date(generatedAt);
  const hoursSince = (now - generated) / (1000 * 60 * 60);
  return hoursSince < CONFIG.cacheDurationHours;
}

/**
 * Format summary for API response
 */
function formatSummaryResponse(summary) {
  return {
    success: true,
    id: summary.id,
    periodType: summary.period_type,
    periodStart: summary.period_start,
    periodEnd: summary.period_end,
    periodLabel: summary.period_label,
    summaryShort: summary.summary_short,
    summaryMedium: summary.summary_medium,
    summaryLong: summary.summary_long,
    highlights: summary.highlights,
    totalMemories: summary.total_memories,
    avgHappiness: summary.avg_happiness,
    happinessTrend: summary.happiness_trend,
    dominantEmotions: summary.dominant_emotions,
    generatedAt: summary.generated_at,
    confidenceScore: summary.confidence_score,
    cached: true
  };
}

// ============================================================================
// BATCH GENERATION
// ============================================================================

/**
 * Generate all summaries for a user
 * Used for initial setup or full regeneration
 */
async function generateAllSummaries(userId, profileId, options = {}) {
  const { forceRegenerate = false, periodTypes = ['year'] } = options;

  console.log(`[SummaryGenerator] Generating all summaries for user ${userId}`);

  // Get timeline overview
  const overview = await queries.getTimelineOverview(userId, profileId);

  if (overview.length === 0) {
    console.log('[SummaryGenerator] No memories found, nothing to summarize');
    return { generated: 0, summaries: [] };
  }

  const summaries = [];
  const errors = [];

  // Generate year summaries for each year
  if (periodTypes.includes('year')) {
    for (const yearData of overview) {
      const year = parseInt(yearData.year);
      try {
        const summary = await generatePeriodSummary(
          userId,
          profileId,
          'year',
          `${year}-01-01`,
          `${year}-12-31`,
          { forceRegenerate }
        );

        if (summary.success) {
          summaries.push({
            id: summary.id,
            label: summary.periodLabel,
            memoryCount: summary.totalMemories
          });
        }
      } catch (error) {
        errors.push({ year, error: error.message });
      }

      // Rate limiting - wait between API calls
      await sleep(1000);
    }
  }

  console.log(`[SummaryGenerator] Generated ${summaries.length} summaries, ${errors.length} errors`);

  return {
    generated: summaries.length,
    summaries,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Generate summaries for a specific year (all periods)
 */
async function generateYearSummaries(userId, profileId, year, options = {}) {
  const { forceRegenerate = false } = options;

  const summaries = [];

  // Generate year summary
  const yearSummary = await generatePeriodSummary(
    userId,
    profileId,
    'year',
    `${year}-01-01`,
    `${year}-12-31`,
    { forceRegenerate }
  );

  if (yearSummary.success) {
    summaries.push(yearSummary);
  }

  // Generate quarter summaries
  for (let quarter = 1; quarter <= 4; quarter++) {
    const startMonth = (quarter - 1) * 3 + 1;
    const endMonth = quarter * 3;
    const startDate = `${year}-${String(startMonth).padStart(2, '0')}-01`;
    const endDate = new Date(year, endMonth, 0).toISOString().split('T')[0];

    try {
      const quarterSummary = await generatePeriodSummary(
        userId,
        profileId,
        'quarter',
        startDate,
        endDate,
        { forceRegenerate }
      );

      if (quarterSummary.success) {
        summaries.push(quarterSummary);
      }
    } catch (error) {
      console.error(`[SummaryGenerator] Error generating Q${quarter} ${year}:`, error.message);
    }

    await sleep(500);
  }

  return summaries;
}

/**
 * Sleep utility for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Main generation
  generatePeriodSummary,

  // Batch generation
  generateAllSummaries,
  generateYearSummaries,

  // Utilities (exported for testing)
  calculateMetrics,
  extractHighlights,
  formatPeriodLabel
};
