/**
 * Timeline Console Route Module
 *
 * December 21, 2025
 * Decade -> Day navigation with AI-generated summaries.
 * Biography intelligent curation + Timeline Console API (PostgreSQL + pgvector).
 */

const { onCall, admin, anthropicKey, geminiKey, logger } = require('./shared');

const db = admin.firestore();

// ---------------------------------------------------------------------------
// Module Imports (paths relative to functions/routes/)
// ---------------------------------------------------------------------------
const timelineServices = require('../timeline');
const biographyExtractor = require('../timeline/biographyExtractor');
const { answerNeuralPathway } = require('../biography/answerNeuralPathway');
const timelineEndpoints = require('../timeline/timelineEndpoints');

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
module.exports = {

  // =========================================================================
  // TIMELINE CONSOLE ENDPOINTS (Firestore life_timeline)
  // =========================================================================

  /**
   * Get timeline overview for a user (all years with memory counts)
   */
  getTimelineOverview: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId } = request.data;

      if (!userId || !profileId) {
        return { success: false, error: 'Missing userId or profileId' };
      }

      // Read from Firestore life_timeline collection
      const memoriesRef = db
        .collection('users').doc(userId)
        .collection('memory').doc(profileId)
        .collection('user')
        .doc('life_timeline')
        .collection('memories');

      const snapshot = await memoriesRef.orderBy('createdAt', 'desc').get();

      // Group by year
      const yearMap = new Map();
      snapshot.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate() || new Date();
        const year = createdAt.getFullYear();

        if (!yearMap.has(year)) {
          yearMap.set(year, {
            year,
            memory_count: 0,
            memories: []
          });
        }

        const yearData = yearMap.get(year);
        yearData.memory_count++;
        yearData.memories.push({
          id: doc.id,
          content: data.content?.substring(0, 200) + (data.content?.length > 200 ? '...' : ''),
          chapter: data.chapter,
          chapterName: data.chapterName,
          importance: data.importance,
          emotion: data.emotion,
          createdAt: createdAt.toISOString()
        });
      });

      // Convert to array sorted by year descending
      const overview = Array.from(yearMap.values()).sort((a, b) => b.year - a.year);

      logger.info('[Timeline] Overview loaded:', overview.length, 'years,', snapshot.size, 'total memories');

      return {
        success: true,
        overview,
        totalMemories: snapshot.size,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] getTimelineOverview error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get timeline statistics for dashboard
   * NOTE: Renamed to getLifeTimelineStats to avoid conflict with timelineEndpoints.getTimelineStats
   */
  getLifeTimelineStats: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId } = request.data;

      if (!userId || !profileId) {
        return { success: false, error: 'Missing userId or profileId' };
      }

      // Read from Firestore life_timeline collection
      const memoriesRef = db
        .collection('users').doc(userId)
        .collection('memory').doc(profileId)
        .collection('user')
        .doc('life_timeline')
        .collection('memories');

      const snapshot = await memoriesRef.get();

      // Calculate stats
      const chapterCounts = {};
      const emotionCounts = {};
      let totalImportance = 0;
      let earliestDate = null;
      let latestDate = null;

      snapshot.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate();

        // Chapter counts
        const chapter = data.chapter || 'unknown';
        chapterCounts[chapter] = (chapterCounts[chapter] || 0) + 1;

        // Emotion counts
        const emotion = data.emotion || 'neutral';
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;

        // Importance
        totalImportance += data.importance || 0.5;

        // Date range
        if (createdAt) {
          if (!earliestDate || createdAt < earliestDate) earliestDate = createdAt;
          if (!latestDate || createdAt > latestDate) latestDate = createdAt;
        }
      });

      const stats = {
        totalMemories: snapshot.size,
        chapterCounts,
        emotionCounts,
        averageImportance: snapshot.size > 0 ? (totalImportance / snapshot.size).toFixed(2) : 0,
        dateRange: {
          earliest: earliestDate?.toISOString() || null,
          latest: latestDate?.toISOString() || null
        }
      };

      logger.info('[Timeline] Stats loaded:', stats.totalMemories, 'memories');

      return {
        success: true,
        stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] getTimelineStats error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get or generate period summary
   */
  getTimelineSummary: onCall({
    timeoutSeconds: 120,
    memory: '512MiB',
    secrets: [anthropicKey],
  }, async (request) => {
    try {
      const { userId, profileId, periodType, periodStart, periodEnd, forceRegenerate } = request.data;

      if (!userId || !profileId || !periodType || !periodStart || !periodEnd) {
        return { success: false, error: 'Missing required parameters' };
      }

      // Try to get existing summary first
      if (!forceRegenerate) {
        const existing = await timelineServices.getSummary(userId, profileId, periodType, periodStart);
        if (existing) {
          return {
            success: true,
            summary: existing,
            cached: true,
            timestamp: new Date().toISOString()
          };
        }
      }

      // Generate new summary
      const summary = await timelineServices.generatePeriodSummary(
        userId, profileId, periodType, periodStart, periodEnd,
        { forceRegenerate: forceRegenerate || false }
      );

      return {
        success: summary.success !== false,
        summary,
        cached: false,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] getTimelineSummary error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get all summaries for a user
   */
  getAllTimelineSummaries: onCall({
    timeoutSeconds: 60,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId, periodType } = request.data;

      if (!userId || !profileId) {
        return { success: false, error: 'Missing userId or profileId' };
      }

      const summaries = await timelineServices.getAllSummaries(userId, profileId, periodType);

      return {
        success: true,
        summaries,
        count: summaries.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] getAllTimelineSummaries error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get monthly memory counts for a year (for heatmap)
   */
  getMonthlyMemoryCounts: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId, year } = request.data;

      if (!userId || !profileId || !year) {
        return { success: false, error: 'Missing required parameters' };
      }

      // Read from Firestore life_timeline collection
      const memoriesRef = db
        .collection('users').doc(userId)
        .collection('memory').doc(profileId)
        .collection('user')
        .doc('life_timeline')
        .collection('memories');

      const snapshot = await memoriesRef.get();

      // Initialize monthly counts (1-12)
      const monthlyData = {};
      for (let m = 1; m <= 12; m++) {
        monthlyData[m] = { month: m, memory_count: 0, avg_happiness: null, happinessSum: 0 };
      }

      // Group by month for the requested year
      snapshot.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate() || new Date();
        const docYear = createdAt.getFullYear();
        const docMonth = createdAt.getMonth() + 1; // JavaScript months are 0-indexed

        if (docYear === parseInt(year)) {
          monthlyData[docMonth].memory_count++;
          if (data.happiness_score || data.happinessScore) {
            monthlyData[docMonth].happinessSum += (data.happiness_score || data.happinessScore);
          }
        }
      });

      // Calculate averages and convert to array
      const counts = Object.values(monthlyData).map(m => {
        return {
          month: m.month,
          memory_count: m.memory_count,
          avg_happiness: m.memory_count > 0 && m.happinessSum > 0
            ? (m.happinessSum / m.memory_count).toFixed(2)
            : null
        };
      });

      logger.info(`[Timeline] Monthly counts for ${year}:`, counts.filter(c => c.memory_count > 0));

      return {
        success: true,
        year,
        counts,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] getMonthlyMemoryCounts error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get memories for a specific day
   */
  getMemoriesForDay: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId, date } = request.data;

      if (!userId || !profileId || !date) {
        return { success: false, error: 'Missing required parameters' };
      }

      // Parse the target date
      const targetDate = new Date(date);
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();
      const targetDay = targetDate.getDate();

      // Read from Firestore life_timeline collection
      const memoriesRef = db
        .collection('users').doc(userId)
        .collection('memory').doc(profileId)
        .collection('user')
        .doc('life_timeline')
        .collection('memories');

      const snapshot = await memoriesRef.orderBy('createdAt', 'desc').get();

      // Filter for the specific day
      const memories = [];
      let closest = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate() || new Date();
        const docYear = createdAt.getFullYear();
        const docMonth = createdAt.getMonth();
        const docDay = createdAt.getDate();

        // Check if same day
        if (docYear === targetYear && docMonth === targetMonth && docDay === targetDay) {
          memories.push({
            id: doc.id,
            content: data.content,
            chapter: data.chapter,
            chapterName: data.chapterName,
            importance: data.importance,
            emotion: data.emotion,
            happiness_score: data.happiness_score || data.happinessScore,
            timestamp: createdAt.toISOString()
          });
        } else if (closest.length < 3) {
          // Track closest memories (different day)
          closest.push({
            id: doc.id,
            content: data.content?.substring(0, 100),
            timestamp: createdAt.toISOString()
          });
        }
      });

      return {
        success: true,
        date,
        memories,
        closest: memories.length === 0 ? closest : null,
        count: memories.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] getMemoriesForDay error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Find memory gaps (periods with few memories)
   */
  findMemoryGaps: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId, threshold } = request.data;

      if (!userId || !profileId) {
        return { success: false, error: 'Missing userId or profileId' };
      }

      const gaps = await timelineServices.findMemoryGaps(userId, profileId, threshold || 10);

      return {
        success: true,
        gaps,
        count: gaps.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] findMemoryGaps error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Search timeline by keyword
   */
  searchTimeline: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId, searchTerm, limit } = request.data;

      if (!userId || !profileId || !searchTerm) {
        return { success: false, error: 'Missing required parameters' };
      }

      const results = await timelineServices.searchTimelineByKeyword(userId, profileId, searchTerm, limit || 20);

      return {
        success: true,
        searchTerm,
        results,
        count: results.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] searchTimeline error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get cultural context for a year/month
   */
  getTimelineCulturalContext: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { year, month, category, region, limit } = request.data;

      if (!year) {
        return { success: false, error: 'Missing year parameter' };
      }

      const context = await timelineServices.getCulturalContext(year, { month, category, region, limit });

      return {
        success: true,
        year,
        month: month || null,
        context,
        count: context.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] getTimelineCulturalContext error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Search cultural context
   */
  searchCulturalContext: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { searchTerm, yearStart, yearEnd, category, limit } = request.data;

      if (!searchTerm) {
        return { success: false, error: 'Missing searchTerm parameter' };
      }

      const results = await timelineServices.searchCulturalContext(searchTerm, { yearStart, yearEnd, category, limit });

      return {
        success: true,
        searchTerm,
        results,
        count: results.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] searchCulturalContext error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Store cultural context item
   */
  storeCulturalContextItem: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const contextData = request.data;

      if (!contextData.year || !contextData.category || !contextData.title) {
        return { success: false, error: 'Missing required fields: year, category, title' };
      }

      const id = await timelineServices.storeCulturalContext(contextData);

      return {
        success: true,
        id,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] storeCulturalContextItem error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Record memory trigger (cultural context -> memory)
   */
  recordMemoryTrigger: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const triggerData = request.data;

      if (!triggerData.userId || !triggerData.profileId || !triggerData.culturalContextId || !triggerData.memoryId) {
        return { success: false, error: 'Missing required trigger data' };
      }

      const id = await timelineServices.recordMemoryTrigger(triggerData);

      return {
        success: true,
        id,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] recordMemoryTrigger error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get trigger analytics for a user
   */
  getTriggerAnalytics: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId } = request.data;

      if (!userId || !profileId) {
        return { success: false, error: 'Missing userId or profileId' };
      }

      const analytics = await timelineServices.getTriggerAnalytics(userId, profileId);

      return {
        success: true,
        analytics,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] getTriggerAnalytics error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Generate all summaries for a user (admin/batch operation)
   */
  generateAllTimelineSummaries: onCall({
    timeoutSeconds: 540,
    memory: '1GiB',
    secrets: [anthropicKey, geminiKey],
  }, async (request) => {
    try {
      const { userId, profileId, forceRegenerate, periodTypes } = request.data;

      if (!userId || !profileId) {
        return { success: false, error: 'Missing userId or profileId' };
      }

      const result = await timelineServices.generateAllSummaries(userId, profileId, {
        forceRegenerate: forceRegenerate || false,
        periodTypes: periodTypes || ['year']
      });

      return {
        success: true,
        generated: result.generated,
        summaries: result.summaries,
        errors: result.errors,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Timeline] generateAllTimelineSummaries error:', error);
      return { success: false, error: error.message };
    }
  }),

  // =========================================================================
  // BIOGRAPHY INTELLIGENT CURATION
  // =========================================================================

  /**
   * Extract life events from a message
   */
  extractLifeEvents: onCall({
    timeoutSeconds: 60,
    memory: '512MiB',
    secrets: [geminiKey],
  }, async (request) => {
    try {
      const { message, userId, profileId, userName, birthDate, conversationId, messageId } = request.data;

      if (!message || !userId || !profileId) {
        return { success: false, error: 'Missing required parameters' };
      }

      // Extract life events
      const extraction = await biographyExtractor.extractLifeEvents(message, {
        userName,
        birthDate,
        conversationId,
        messageId
      });

      // If events were found, store them
      if (extraction.has_life_events && extraction.events.length > 0) {
        const stored = [];
        for (const event of extraction.events) {
          const result = await biographyExtractor.storeLifeEvent(db, userId, profileId, event);
          stored.push(result);
        }
        extraction.stored = stored;
      }

      return {
        success: true,
        ...extraction,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Biography] extractLifeEvents error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get biography timeline (curated life events)
   */
  getBiographyTimeline: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId } = request.data;

      if (!userId || !profileId) {
        return { success: false, error: 'Missing userId or profileId' };
      }

      const timeline = await biographyExtractor.getBiographyTimeline(db, userId, profileId);

      return {
        success: true,
        ...timeline,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Biography] getBiographyTimeline error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get biography statistics and coverage
   */
  getBiographyStats: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId } = request.data;

      if (!userId || !profileId) {
        return { success: false, error: 'Missing userId or profileId' };
      }

      const stats = await biographyExtractor.getBiographyStats(db, userId, profileId);

      return {
        success: true,
        stats,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Biography] getBiographyStats error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get neural pathways (unanswered questions to explore)
   */
  getNeuralPathways: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId, limit } = request.data;

      if (!userId || !profileId) {
        return { success: false, error: 'Missing userId or profileId' };
      }

      const pathways = await biographyExtractor.getNeuralPathways(db, userId, profileId, limit || 10);

      return {
        success: true,
        pathways,
        count: pathways.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Biography] getNeuralPathways error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Mark a neural pathway question as answered/resolved
   */
  answerNeuralPathway: answerNeuralPathway,

  resolveNeuralPathway: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      const { userId, profileId, eventId, question } = request.data;

      if (!userId || !profileId || !eventId || !question) {
        return { success: false, error: 'Missing required parameters' };
      }

      const eventRef = db
        .collection('users').doc(userId)
        .collection('biography').doc(profileId)
        .collection('life_events').doc(eventId);

      const eventDoc = await eventRef.get();
      if (!eventDoc.exists) {
        return { success: false, error: 'Event not found' };
      }

      const eventData = eventDoc.data();
      const updatedPathways = (eventData.neural_pathways || [])
        .filter(q => q !== question);

      await eventRef.update({
        neural_pathways: updatedPathways,
        resolved_pathways: [...(eventData.resolved_pathways || []), {
          question,
          resolvedAt: new Date().toISOString()
        }],
        updatedAt: new Date()
      });

      return {
        success: true,
        remainingPathways: updatedPathways.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('[Biography] resolveNeuralPathway error:', error);
      return { success: false, error: error.message };
    }
  }),

  // =========================================================================
  // TIMELINE CONSOLE API (PostgreSQL + pgvector)
  // =========================================================================

  /**
   * Get timeline events for a person
   */
  getTimelineEvents: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleGetEvents(request.data);
    } catch (error) {
      logger.error('[Timeline] getTimelineEvents error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get a single event with details
   */
  getTimelineEvent: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleGetEvent(request.data);
    } catch (error) {
      logger.error('[Timeline] getTimelineEvent error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Update a timeline event
   */
  updateTimelineEvent: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleUpdateEvent(request.data);
    } catch (error) {
      logger.error('[Timeline] updateTimelineEvent error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Delete a timeline event
   */
  deleteTimelineEvent: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleDeleteEvent(request.data);
    } catch (error) {
      logger.error('[Timeline] deleteTimelineEvent error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get timeline questions (neural pathways) for a person
   */
  getTimelineQuestions: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleGetQuestions(request.data);
    } catch (error) {
      logger.error('[Timeline] getTimelineQuestions error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Mark a timeline question as answered
   */
  answerTimelineQuestion: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleAnswerQuestion(request.data);
    } catch (error) {
      logger.error('[Timeline] answerTimelineQuestion error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Skip a timeline question
   */
  skipTimelineQuestion: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleSkipQuestion(request.data);
    } catch (error) {
      logger.error('[Timeline] skipTimelineQuestion error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get all people in a timeline
   */
  getTimelinePeople: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleGetPeople(request.data);
    } catch (error) {
      logger.error('[Timeline] getTimelinePeople error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Create or update a person
   */
  upsertTimelinePerson: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleUpsertPerson(request.data);
    } catch (error) {
      logger.error('[Timeline] upsertTimelinePerson error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Get timeline stats
   */
  getTimelineStats: onCall({
    timeoutSeconds: 30,
    memory: '256MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleGetStats(request.data);
    } catch (error) {
      logger.error('[Timeline] getTimelineStats error:', error);
      return { success: false, error: error.message };
    }
  }),

  /**
   * Semantic search across timeline events
   */
  searchTimelineEvents: onCall({
    timeoutSeconds: 60,
    memory: '512MiB'
  }, async (request) => {
    try {
      return await timelineEndpoints.handleSearchEvents(request.data);
    } catch (error) {
      logger.error('[Timeline] searchTimelineEvents error:', error);
      return { success: false, error: error.message };
    }
  }),
};
