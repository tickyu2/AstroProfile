/**
 * Nightly Consolidation Cloud Function
 *
 * Runs at 3:00 AM UTC every day to:
 * 1. Brain 1B → Brain 2 (facts STM → LTM)
 * 2. Brain 3 → Brain 4 (text STM → LTM)
 * 3. Brain 5 → Brain 6 (audio STM → LTM)
 * 4. Brain 7C → Archives (Luna's witness)
 * 5. Synthesize to Brain 8 (Luna's LTM vector)
 * 6. Apply memory decay
 *
 * Part of GENESIS 8-Brain Memory Architecture v3.0
 * Created: January 5, 2026
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { runConsolidation: consolidateBrain1B } = require('./brain1BService');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Score thresholds
  promotionThreshold: 0.6,
  decayThreshold: 0.4,

  // Decay settings
  decayStartDays: 7,
  decayFactor: 0.02,
  maxDecay: 0.7,

  // Archive limits
  maxTextArchives: 100,
  maxAudioArchives: 50,
  maxWitnessArchives: 30,

  // Batch processing
  batchSize: 500
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getDb() {
  return admin.firestore();
}

/**
 * Get all active users (users with activity in last 30 days)
 */
async function getActiveUsers() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get users with recent brain3 activity
  const usersSnapshot = await getDb().collection('users')
    .where('lastActive', '>=', thirtyDaysAgo)
    .get();

  const users = [];
  for (const doc of usersSnapshot.docs) {
    users.push({
      id: doc.id,
      ...doc.data()
    });
  }

  // If no lastActive field, get users with recent messages
  if (users.length === 0) {
    const messagesSnapshot = await getDb().collectionGroup('brain3_active_text')
      .where('timestamp', '>=', thirtyDaysAgo)
      .limit(1000)
      .get();

    const userIds = new Set();
    for (const doc of messagesSnapshot.docs) {
      const pathParts = doc.ref.path.split('/');
      if (pathParts[0] === 'users' && pathParts[1]) {
        userIds.add(pathParts[1]);
      }
    }

    for (const userId of userIds) {
      users.push({ id: userId });
    }
  }

  return users;
}

/**
 * Calculate promotion score for a message
 */
function calculateMessageScore(message, options = {}) {
  let score = 0.5; // Base score

  // Emotional intensity
  if (message.emotion) {
    const highEmotions = ['grief', 'joy', 'love', 'anger', 'fear', 'breakthrough'];
    if (highEmotions.includes(message.emotion)) {
      score += 0.2;
    }
  }

  // Sentiment intensity
  if (message.sentiment) {
    if (message.sentiment !== 'neutral') {
      score += 0.1;
    }
  }

  // Constitutional relevance
  if (message.constitutionalRelevance) {
    score += message.constitutionalRelevance * 0.2;
  }

  // Contains insight keywords
  const insightKeywords = ['realized', 'understand', 'finally', 'breakthrough', 'insight', 'learned', 'discover'];
  const lowerText = (message.text || message.content || '').toLowerCase();
  for (const keyword of insightKeywords) {
    if (lowerText.includes(keyword)) {
      score += 0.1;
      break;
    }
  }

  // Message length (longer = more substantial)
  const textLength = (message.text || message.content || '').length;
  if (textLength > 200) score += 0.05;
  if (textLength > 500) score += 0.05;

  // Cap at 1.0
  return Math.min(1.0, score);
}

// ============================================
// BRAIN 3 → BRAIN 4 (Text Consolidation)
// ============================================

async function consolidateTextChannel(userId) {
  const brain3Ref = getDb().collection('users').doc(userId).collection('brain3_active_text');
  const brain4Ref = getDb().collection('users').doc(userId).collection('brain4_text_archives');

  // Get all Brain 3 messages
  const snapshot = await brain3Ref.orderBy('timestamp', 'desc').get();

  if (snapshot.empty) {
    return { processed: 0, promoted: 0, deleted: 0 };
  }

  const batch = getDb().batch();
  let promoted = 0;
  let deleted = 0;

  // Group messages by conversation/session
  const sessions = groupMessagesBySession(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));

  for (const [sessionId, messages] of Object.entries(sessions)) {
    // Find high-value messages in this session
    const highValueMessages = [];

    for (const message of messages) {
      const score = calculateMessageScore(message);

      if (score >= CONFIG.promotionThreshold) {
        highValueMessages.push({
          ...message,
          promotionScore: score
        });
      }
    }

    // If session has high-value content, create archive entry
    if (highValueMessages.length > 0) {
      const archiveId = `session_${sessionId}_${Date.now()}`;
      const archiveEntry = {
        sessionId,
        archivedAt: admin.firestore.FieldValue.serverTimestamp(),
        messageCount: highValueMessages.length,
        highlights: highValueMessages.map(m => ({
          text: m.text || m.content,
          timestamp: m.timestamp,
          score: m.promotionScore,
          emotion: m.emotion,
          speaker: m.role || m.speaker
        })),
        // Extract key insights
        insights: extractInsights(highValueMessages),
        // Overall session sentiment
        sessionSentiment: calculateSessionSentiment(highValueMessages)
      };

      batch.set(brain4Ref.doc(archiveId), archiveEntry);
      promoted++;
    }

    // Delete processed messages from Brain 3
    for (const message of messages) {
      batch.delete(brain3Ref.doc(message.id));
      deleted++;
    }
  }

  // Commit batch
  await batch.commit();

  // Trim Brain 4 if too large
  await trimArchive(brain4Ref, CONFIG.maxTextArchives);

  return { processed: snapshot.size, promoted, deleted };
}

/**
 * Group messages by session (15-minute gap = new session)
 */
function groupMessagesBySession(messages) {
  const sessions = {};
  let currentSession = null;
  let lastTimestamp = null;

  const sortedMessages = messages.sort((a, b) => {
    const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp);
    const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp);
    return timeA - timeB;
  });

  for (const message of sortedMessages) {
    const messageTime = message.timestamp?.toDate?.() || new Date(message.timestamp);

    // Check if new session (15-minute gap)
    if (!lastTimestamp || (messageTime - lastTimestamp) > 15 * 60 * 1000) {
      currentSession = `${messageTime.toISOString().split('T')[0]}_${messageTime.getHours()}`;
    }

    if (!sessions[currentSession]) {
      sessions[currentSession] = [];
    }

    sessions[currentSession].push(message);
    lastTimestamp = messageTime;
  }

  return sessions;
}

/**
 * Extract insights from high-value messages
 */
function extractInsights(messages) {
  const insights = [];

  for (const message of messages) {
    const text = message.text || message.content || '';

    // Look for insight patterns
    const insightPatterns = [
      /I (?:finally )?(?:realized|understand) (?:that )?(.+?)(?:\.|$)/i,
      /(?:breakthrough|insight|discovery)[:.]?\s*(.+?)(?:\.|$)/i,
      /(?:now I (?:know|see|get) (?:that )?)?(.+?) (?:makes sense|clicked)/i
    ];

    for (const pattern of insightPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        insights.push({
          text: match[1].trim(),
          timestamp: message.timestamp,
          score: message.promotionScore
        });
      }
    }
  }

  return insights.slice(0, 5); // Keep top 5 insights
}

/**
 * Calculate overall session sentiment
 */
function calculateSessionSentiment(messages) {
  let positive = 0;
  let negative = 0;
  let neutral = 0;

  for (const message of messages) {
    if (message.sentiment === 'positive') positive++;
    else if (message.sentiment === 'negative') negative++;
    else neutral++;
  }

  const total = positive + negative + neutral;
  return {
    positive: positive / total,
    negative: negative / total,
    neutral: neutral / total,
    dominant: positive > negative ? (positive > neutral ? 'positive' : 'neutral') :
              negative > neutral ? 'negative' : 'neutral'
  };
}

// ============================================
// BRAIN 5 → BRAIN 6 (Audio Consolidation)
// ============================================

async function consolidateAudioChannel(userId) {
  const brain5Ref = getDb().collection('users').doc(userId).collection('brain5_active_audio');
  const brain6Ref = getDb().collection('users').doc(userId).collection('brain6_audio_archives');

  const snapshot = await brain5Ref.orderBy('timestamp', 'desc').get();

  if (snapshot.empty) {
    return { processed: 0, promoted: 0 };
  }

  const batch = getDb().batch();
  let promoted = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const score = calculateAudioScore(data);

    if (score >= CONFIG.promotionThreshold) {
      // Create archive entry
      const archiveEntry = {
        ...data,
        archivedAt: admin.firestore.FieldValue.serverTimestamp(),
        promotionScore: score,
        // Extract emotional moments
        emotionalHighlights: extractEmotionalMoments(data)
      };

      const archiveId = `audio_${doc.id}`;
      batch.set(brain6Ref.doc(archiveId), archiveEntry);
      promoted++;
    }

    // Delete from Brain 5
    batch.delete(brain5Ref.doc(doc.id));
  }

  await batch.commit();

  // Trim Brain 6 if too large
  await trimArchive(brain6Ref, CONFIG.maxAudioArchives);

  return { processed: snapshot.size, promoted };
}

/**
 * Calculate score for audio session
 */
function calculateAudioScore(audioData) {
  let score = 0.5;

  // Voice emotion detected
  if (audioData.voiceEmotion) {
    const highEmotions = ['crying', 'laughing', 'excitement', 'distress'];
    if (highEmotions.some(e => audioData.voiceEmotion.includes(e))) {
      score += 0.3;
    }
  }

  // Duration (longer = more substantial)
  if (audioData.duration) {
    if (audioData.duration > 300) score += 0.1; // > 5 minutes
    if (audioData.duration > 600) score += 0.1; // > 10 minutes
  }

  // Contains transcribed text with insights
  if (audioData.transcript) {
    const insightKeywords = ['realized', 'understand', 'finally', 'breakthrough'];
    if (insightKeywords.some(k => audioData.transcript.toLowerCase().includes(k))) {
      score += 0.15;
    }
  }

  return Math.min(1.0, score);
}

/**
 * Extract emotional moments from audio
 */
function extractEmotionalMoments(audioData) {
  const moments = [];

  if (audioData.emotionTimeline) {
    for (const entry of audioData.emotionTimeline) {
      if (entry.intensity > 0.7) {
        moments.push({
          timestamp: entry.timestamp,
          emotion: entry.emotion,
          intensity: entry.intensity
        });
      }
    }
  }

  return moments.slice(0, 10); // Keep top 10 moments
}

// ============================================
// BRAIN 7C → Archives (Luna's Witness)
// ============================================

async function processWitnessBrain(userId) {
  const brain7CRef = getDb().collection('users').doc(userId).collection('brain7_luna').doc('witness');
  const witnessArchiveRef = getDb().collection('users').doc(userId).collection('brain7_luna_witness_archive');

  const witnessDoc = await brain7CRef.get();

  if (!witnessDoc.exists) {
    return { processed: false };
  }

  const witnessData = witnessDoc.data();

  // Archive today's witness
  const archiveEntry = {
    ...witnessData,
    archivedAt: admin.firestore.FieldValue.serverTimestamp(),
    date: new Date().toISOString().split('T')[0]
  };

  await witnessArchiveRef.add(archiveEntry);

  // Clear witness for new day (keep structure, clear entries)
  await brain7CRef.set({
    entries: [],
    lastReset: admin.firestore.FieldValue.serverTimestamp()
  });

  // Trim archive
  await trimArchive(witnessArchiveRef, CONFIG.maxWitnessArchives);

  return { processed: true, entriesArchived: witnessData.entries?.length || 0 };
}

// ============================================
// BRAIN 8 SYNTHESIS
// ============================================

async function synthesizeBrain8(userId) {
  const brain2Ref = getDb().collection('users').doc(userId).collection('brain2_facts_ltm');
  const brain4Ref = getDb().collection('users').doc(userId).collection('brain4_text_archives');
  const brain6Ref = getDb().collection('users').doc(userId).collection('brain6_audio_archives');
  const brain8Ref = getDb().collection('users').doc(userId).collection('brain8_relationship');

  // Get data from all sources
  const [brain2Snap, brain4Snap, brain6Snap] = await Promise.all([
    brain2Ref.get(),
    brain4Ref.orderBy('archivedAt', 'desc').limit(20).get(),
    brain6Ref.orderBy('archivedAt', 'desc').limit(10).get()
  ]);

  // Build relationship patterns
  const patterns = {
    // From Brain 2: Key people in user's life
    relationships: brain2Snap.docs
      .filter(d => d.data().category === 'relationship')
      .map(d => ({
        name: d.data().name,
        role: d.data().type,
        sentiment: d.data().sentiment,
        mentions: d.data().mentions
      })),

    // From Brain 2: Life structure
    lifeContext: brain2Snap.docs
      .filter(d => d.data().category === 'life_structure')
      .reduce((acc, d) => {
        acc[d.data().type] = d.data().value;
        return acc;
      }, {}),

    // From Brain 4: Communication patterns
    conversationPatterns: analyzeConversationPatterns(brain4Snap.docs.map(d => d.data())),

    // From Brain 6: Emotional patterns
    emotionalPatterns: analyzeEmotionalPatterns(brain6Snap.docs.map(d => d.data())),

    // Synthesis timestamp
    synthesizedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  // Calculate relationship insights
  patterns.insights = generateRelationshipInsights(patterns);

  // Store in Brain 8
  await brain8Ref.doc('synthesis').set(patterns, { merge: true });

  return { synthesized: true };
}

/**
 * Analyze conversation patterns from archives
 */
function analyzeConversationPatterns(archives) {
  const patterns = {
    preferredTopics: {},
    responsePatterns: {},
    peakTimes: {}
  };

  for (const archive of archives) {
    // Count topics
    if (archive.insights) {
      for (const insight of archive.insights) {
        // Simple topic extraction from insights
        const words = insight.text.toLowerCase().split(/\s+/);
        for (const word of words) {
          if (word.length > 5) {
            patterns.preferredTopics[word] = (patterns.preferredTopics[word] || 0) + 1;
          }
        }
      }
    }

    // Track sentiment patterns
    if (archive.sessionSentiment?.dominant) {
      const sentiment = archive.sessionSentiment.dominant;
      patterns.responsePatterns[sentiment] = (patterns.responsePatterns[sentiment] || 0) + 1;
    }
  }

  return patterns;
}

/**
 * Analyze emotional patterns from audio archives
 */
function analyzeEmotionalPatterns(archives) {
  const patterns = {
    dominantEmotions: {},
    emotionalRange: { min: 1, max: 0 }
  };

  for (const archive of archives) {
    if (archive.emotionalHighlights) {
      for (const moment of archive.emotionalHighlights) {
        patterns.dominantEmotions[moment.emotion] =
          (patterns.dominantEmotions[moment.emotion] || 0) + 1;

        patterns.emotionalRange.min = Math.min(patterns.emotionalRange.min, moment.intensity);
        patterns.emotionalRange.max = Math.max(patterns.emotionalRange.max, moment.intensity);
      }
    }
  }

  return patterns;
}

/**
 * Generate relationship insights from patterns
 */
function generateRelationshipInsights(patterns) {
  const insights = [];

  // Key relationships
  const topRelationships = patterns.relationships
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, 5);

  if (topRelationships.length > 0) {
    insights.push({
      type: 'key_relationships',
      description: `User frequently mentions: ${topRelationships.map(r => r.name).join(', ')}`,
      data: topRelationships
    });
  }

  // Emotional tendencies
  const emotions = patterns.emotionalPatterns?.dominantEmotions || {};
  const topEmotion = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0];
  if (topEmotion) {
    insights.push({
      type: 'emotional_tendency',
      description: `User often expresses ${topEmotion[0]} in conversations`,
      data: emotions
    });
  }

  return insights;
}

// ============================================
// MEMORY DECAY
// ============================================

async function applyMemoryDecay(userId) {
  const brain1BRef = getDb().collection('users').doc(userId).collection('brain1_facts_stm');

  const snapshot = await brain1BRef.get();

  if (snapshot.empty) {
    return { decayed: 0 };
  }

  const batch = getDb().batch();
  let decayed = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const lastUpdate = data.updatedAt?.toDate?.() || new Date(data.timestamp);
    const daysSinceUpdate = Math.floor((Date.now() - lastUpdate) / (1000 * 60 * 60 * 24));

    if (daysSinceUpdate > CONFIG.decayStartDays) {
      const currentConfidence = data.confidence || 0.7;
      const decayAmount = (daysSinceUpdate - CONFIG.decayStartDays) * CONFIG.decayFactor;
      const newConfidence = Math.max(0.3, currentConfidence - decayAmount);

      if (newConfidence < CONFIG.decayThreshold) {
        // Delete if too decayed
        batch.delete(doc.ref);
      } else if (newConfidence !== currentConfidence) {
        // Update confidence
        batch.update(doc.ref, { confidence: newConfidence });
      }

      decayed++;
    }
  }

  await batch.commit();

  return { decayed };
}

// ============================================
// ARCHIVE TRIMMING
// ============================================

async function trimArchive(archiveRef, maxCount) {
  const snapshot = await archiveRef.orderBy('archivedAt', 'desc').get();

  if (snapshot.size <= maxCount) {
    return;
  }

  const batch = getDb().batch();
  const docsToDelete = snapshot.docs.slice(maxCount);

  for (const doc of docsToDelete) {
    batch.delete(doc.ref);
  }

  await batch.commit();
}

// ============================================
// MAIN CONSOLIDATION FUNCTION
// ============================================

/**
 * Run full nightly consolidation for all users
 */
async function runNightlyConsolidation() {
  console.log('Starting nightly consolidation...');
  const startTime = Date.now();

  const users = await getActiveUsers();
  console.log(`Processing ${users.length} active users`);

  const results = {
    usersProcessed: 0,
    brain1B: { total: 0, promoted: 0 },
    brain3: { total: 0, promoted: 0 },
    brain5: { total: 0, promoted: 0 },
    brain7C: { total: 0 },
    brain8: { synthesized: 0 },
    decay: { total: 0 },
    errors: []
  };

  for (const user of users) {
    try {
      // 1. Brain 1B → Brain 2 (facts)
      const brain1BResult = await consolidateBrain1B(user.id);
      results.brain1B.total += brain1BResult.processed;
      results.brain1B.promoted += brain1BResult.promoted;

      // 2. Brain 3 → Brain 4 (text)
      const textResult = await consolidateTextChannel(user.id);
      results.brain3.total += textResult.processed;
      results.brain3.promoted += textResult.promoted;

      // 3. Brain 5 → Brain 6 (audio)
      const audioResult = await consolidateAudioChannel(user.id);
      results.brain5.total += audioResult.processed;
      results.brain5.promoted += audioResult.promoted;

      // 4. Brain 7C → Archives (witness)
      const witnessResult = await processWitnessBrain(user.id);
      if (witnessResult.processed) results.brain7C.total++;

      // 5. Synthesize Brain 8
      const brain8Result = await synthesizeBrain8(user.id);
      if (brain8Result.synthesized) results.brain8.synthesized++;

      // 6. Apply decay
      const decayResult = await applyMemoryDecay(user.id);
      results.decay.total += decayResult.decayed;

      results.usersProcessed++;

    } catch (error) {
      console.error(`Error processing user ${user.id}:`, error);
      results.errors.push({
        userId: user.id,
        error: error.message
      });
    }
  }

  const duration = Date.now() - startTime;
  console.log(`Consolidation complete in ${duration}ms`, results);

  // Log results to Firestore
  await getDb().collection('system_logs').add({
    type: 'nightly_consolidation',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    duration,
    results
  });

  return results;
}

// ============================================
// CLOUD FUNCTION EXPORTS
// ============================================

/**
 * Scheduled function - runs at 3:00 AM UTC daily
 */
const scheduledConsolidation = functions.pubsub
  .schedule('0 3 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    return await runNightlyConsolidation();
  });

/**
 * HTTP trigger for manual consolidation (admin only)
 */
const manualConsolidation = functions.https.onCall(async (data, context) => {
  // Require admin authentication
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }

  // Optional: consolidate single user
  if (data.userId) {
    const results = {
      brain1B: await consolidateBrain1B(data.userId),
      brain3: await consolidateTextChannel(data.userId),
      brain5: await consolidateAudioChannel(data.userId),
      brain7C: await processWitnessBrain(data.userId),
      brain8: await synthesizeBrain8(data.userId),
      decay: await applyMemoryDecay(data.userId)
    };
    return { success: true, userId: data.userId, results };
  }

  // Full consolidation
  return await runNightlyConsolidation();
});

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Cloud Functions
  scheduledConsolidation,
  manualConsolidation,

  // Core functions (for testing)
  runNightlyConsolidation,
  consolidateTextChannel,
  consolidateAudioChannel,
  processWitnessBrain,
  synthesizeBrain8,
  applyMemoryDecay,

  // Helpers
  calculateMessageScore,
  groupMessagesBySession,
  extractInsights
};
