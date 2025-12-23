/**
 * Usage Functions - Server-Side Rate Limiting & Cost Control
 *
 * Server-side validation is critical because client-side limits can be bypassed.
 * This module provides:
 * - Rate limit checking (authoritative)
 * - Token counting from Gemini responses
 * - Usage recording
 * - Cost attribution
 *
 * Part of GENESIS Phase 6 - Production Hardening
 * December 19, 2024
 */

const admin = require('firebase-admin');
const { onCall, HttpsError } = require('firebase-functions/v2/https');

// Lazy Firestore initialization (avoids issues when module loads before initializeApp)
let _db = null;
const getDb = () => {
  if (!_db) {
    _db = admin.firestore();
  }
  return _db;
};

// ═══════════════════════════════════════════════════════════════════════════
// RATE LIMITS CONFIGURATION (Server-Side Source of Truth)
// ═══════════════════════════════════════════════════════════════════════════

const RATE_LIMITS = {
  free: {
    messagesPerMinute: 5,
    messagesPerHour: 30,
    messagesPerDay: 100,
    tokensPerDay: 50000,
    voiceMinutesPerDay: 10,
    concurrentRequests: 2
  },
  premium: {
    messagesPerMinute: 15,
    messagesPerHour: 100,
    messagesPerDay: 500,
    tokensPerDay: 250000,
    voiceMinutesPerDay: 60,
    concurrentRequests: 5
  },
  unlimited: {
    messagesPerMinute: 999,
    messagesPerHour: 9999,
    messagesPerDay: 99999,
    tokensPerDay: 9999999,
    voiceMinutesPerDay: 9999,
    concurrentRequests: 20
  }
};

// Cost estimates for budget tracking
const COST_PER_1K_TOKENS = {
  input: 0.00035,   // Gemini 2.5 Flash input
  output: 0.00105   // Gemini 2.5 Flash output
};

// ═══════════════════════════════════════════════════════════════════════════
// RATE LIMIT CHECKING (Called before API request)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if user is within rate limits
 * @param {string} userId - Firebase user ID
 * @param {string} userTier - User's subscription tier
 * @returns {Object} - { allowed: boolean, reason?: string }
 */
async function checkRateLimits(userId, userTier = 'free') {
  const limits = RATE_LIMITS[userTier] || RATE_LIMITS.free;
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours().toString();

  // Get today's usage
  const usageRef = getDb().collection('users').doc(userId).collection('usage').doc(today);
  const usageSnap = await usageRef.get();
  const usage = usageSnap.exists ? usageSnap.data() : { messages: 0, totalTokens: 0, hourlyMessages: {} };

  // 1. Check daily message limit
  if (usage.messages >= limits.messagesPerDay) {
    return {
      allowed: false,
      reason: 'daily_limit',
      code: 'DAILY_MESSAGE_LIMIT',
      message: `Daily limit of ${limits.messagesPerDay} messages reached.`,
      retryAfter: getSecondsUntilMidnight()
    };
  }

  // 2. Check daily token limit
  if (usage.totalTokens >= limits.tokensPerDay) {
    return {
      allowed: false,
      reason: 'token_limit',
      code: 'DAILY_TOKEN_LIMIT',
      message: `Daily token budget of ${limits.tokensPerDay} reached.`,
      retryAfter: getSecondsUntilMidnight()
    };
  }

  // 3. Check hourly message limit
  const hourlyMessages = usage.hourlyMessages?.[currentHour] || 0;
  if (hourlyMessages >= limits.messagesPerHour) {
    return {
      allowed: false,
      reason: 'hourly_limit',
      code: 'HOURLY_MESSAGE_LIMIT',
      message: `Hourly limit of ${limits.messagesPerHour} messages reached.`,
      retryAfter: getSecondsUntilNextHour()
    };
  }

  // 4. Check per-minute limit (sliding window)
  const minuteCount = await getRecentMessageCount(userId, 60);
  if (minuteCount >= limits.messagesPerMinute) {
    return {
      allowed: false,
      reason: 'minute_limit',
      code: 'MINUTE_MESSAGE_LIMIT',
      message: 'Please slow down. Too many messages per minute.',
      retryAfter: 15
    };
  }

  // 5. Check concurrent requests
  const concurrentCount = await getConcurrentRequestCount(userId);
  if (concurrentCount >= limits.concurrentRequests) {
    return {
      allowed: false,
      reason: 'concurrent_limit',
      code: 'CONCURRENT_REQUEST_LIMIT',
      message: 'Please wait for current request to complete.',
      retryAfter: 5
    };
  }

  return { allowed: true };
}

/**
 * Get count of messages in the last N seconds
 */
async function getRecentMessageCount(userId, seconds) {
  const cutoff = new Date(Date.now() - seconds * 1000);

  try {
    const eventsRef = getDb().collection('users').doc(userId).collection('usage_events');
    const snapshot = await eventsRef
      .where('type', '==', 'message_complete')
      .where('timestamp', '>', cutoff)
      .limit(20)
      .get();

    return snapshot.size;
  } catch (error) {
    // Index might not exist
    console.warn('[Usage] Recent message count query failed:', error.message);
    return 0;
  }
}

/**
 * Get count of in-flight requests
 */
async function getConcurrentRequestCount(userId) {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

  try {
    const eventsRef = getDb().collection('users').doc(userId).collection('usage_events');
    const snapshot = await eventsRef
      .where('type', '==', 'request_start')
      .where('completed', '==', false)
      .where('timestamp', '>', fiveMinutesAgo)
      .limit(10)
      .get();

    return snapshot.size;
  } catch (error) {
    return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// USAGE RECORDING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Record the start of a request (for concurrent tracking)
 */
async function recordRequestStart(userId, requestId, metadata = {}) {
  const eventsRef = getDb().collection('users').doc(userId).collection('usage_events');

  await eventsRef.doc(requestId).set({
    type: 'request_start',
    requestId,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    completed: false,
    ...metadata
  });

  return requestId;
}

/**
 * Record the completion of a request with token counts
 */
async function recordRequestComplete(userId, requestId, data = {}) {
  const {
    inputTokens = 0,
    outputTokens = 0,
    success = true,
    profileId = null,
    thinkingLevel = 'low',
    responseTime = 0
  } = data;

  const totalTokens = inputTokens + outputTokens;
  const estimatedCost =
    (inputTokens / 1000 * COST_PER_1K_TOKENS.input) +
    (outputTokens / 1000 * COST_PER_1K_TOKENS.output);

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours().toString();

  // Update the request event
  const eventsRef = getDb().collection('users').doc(userId).collection('usage_events');
  await eventsRef.doc(requestId).update({
    type: 'message_complete',
    completed: true,
    completedAt: admin.firestore.FieldValue.serverTimestamp(),
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCost,
    success,
    responseTime
  });

  // Update daily usage
  const usageRef = getDb().collection('users').doc(userId).collection('usage').doc(today);
  await usageRef.set({
    date: today,
    messages: admin.firestore.FieldValue.increment(1),
    inputTokens: admin.firestore.FieldValue.increment(inputTokens),
    outputTokens: admin.firestore.FieldValue.increment(outputTokens),
    totalTokens: admin.firestore.FieldValue.increment(totalTokens),
    estimatedCost: admin.firestore.FieldValue.increment(estimatedCost),
    [`hourlyMessages.${currentHour}`]: admin.firestore.FieldValue.increment(1),
    [`profileUsage.${profileId || 'default'}.messages`]: admin.firestore.FieldValue.increment(1),
    [`profileUsage.${profileId || 'default'}.tokens`]: admin.firestore.FieldValue.increment(totalTokens),
    lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  // Update monthly aggregates for billing
  const monthKey = now.toISOString().slice(0, 7); // YYYY-MM
  const monthlyRef = getDb().collection('users').doc(userId).collection('usage_monthly').doc(monthKey);
  await monthlyRef.set({
    month: monthKey,
    messages: admin.firestore.FieldValue.increment(1),
    totalTokens: admin.firestore.FieldValue.increment(totalTokens),
    estimatedCost: admin.firestore.FieldValue.increment(estimatedCost),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  return {
    success: true,
    recorded: {
      tokens: totalTokens,
      cost: estimatedCost
    }
  };
}

/**
 * Record a failed request (doesn't count toward limits)
 */
async function recordRequestFailed(userId, requestId, error) {
  const eventsRef = getDb().collection('users').doc(userId).collection('usage_events');

  await eventsRef.doc(requestId).update({
    completed: true,
    success: false,
    error: error.message || 'Unknown error',
    failedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// USAGE QUERY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get user's usage summary
 */
async function getUserUsageSummary(userId, userTier = 'free') {
  const limits = RATE_LIMITS[userTier] || RATE_LIMITS.free;
  const today = new Date().toISOString().split('T')[0];

  const usageRef = getDb().collection('users').doc(userId).collection('usage').doc(today);
  const usageSnap = await usageRef.get();
  const usage = usageSnap.exists ? usageSnap.data() : {
    messages: 0,
    totalTokens: 0,
    estimatedCost: 0,
    voiceMinutes: 0
  };

  return {
    tier: userTier,
    today: {
      messages: {
        used: usage.messages || 0,
        limit: limits.messagesPerDay,
        remaining: Math.max(0, limits.messagesPerDay - (usage.messages || 0)),
        percent: Math.round(((usage.messages || 0) / limits.messagesPerDay) * 100)
      },
      tokens: {
        used: usage.totalTokens || 0,
        limit: limits.tokensPerDay,
        remaining: Math.max(0, limits.tokensPerDay - (usage.totalTokens || 0)),
        percent: Math.round(((usage.totalTokens || 0) / limits.tokensPerDay) * 100)
      },
      cost: {
        estimated: Math.round((usage.estimatedCost || 0) * 10000) / 10000
      }
    },
    limits
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function getSecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
}

function getSecondsUntilNextHour() {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
  return Math.floor((nextHour - now) / 1000);
}

function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTED CLOUD FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check rate limits (callable function)
 */
const checkUsageLimits = onCall({
  region: 'us-central1',
  memory: '256MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const userId = request.auth.uid;

  // Get user tier from profile
  const userRef = getDb().collection('users').doc(userId);
  const userSnap = await userRef.get();
  const userTier = userSnap.exists ? (userSnap.data().subscriptionTier || 'free') : 'free';

  const result = await checkRateLimits(userId, userTier);

  return result;
});

/**
 * Get usage summary (callable function)
 */
const getUsageSummary = onCall({
  region: 'us-central1',
  memory: '256MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const userId = request.auth.uid;

  // Get user tier
  const userRef = getDb().collection('users').doc(userId);
  const userSnap = await userRef.get();
  const userTier = userSnap.exists ? (userSnap.data().subscriptionTier || 'free') : 'free';

  const summary = await getUserUsageSummary(userId, userTier);

  return { success: true, ...summary };
});

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN FUNCTIONS - Cross-User Aggregation
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get platform-wide usage statistics (admin only)
 */
const getAdminUsageStats = onCall({
  region: 'us-central1',
  memory: '512MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const userId = request.auth.uid;

  // Check if user is admin
  const userRef = getDb().collection('users').doc(userId);
  const userSnap = await userRef.get();
  const userData = userSnap.exists ? userSnap.data() : {};

  if (!userData.isAdmin && !userData.role?.includes('admin')) {
    throw new HttpsError('permission-denied', 'Admin access required');
  }

  const { days = 7 } = request.data || {};
  const today = new Date();
  const stats = {
    generatedAt: new Date().toISOString(),
    period: { days, startDate: null, endDate: today.toISOString().split('T')[0] },
    totals: { users: 0, messages: 0, tokens: 0, cost: 0 },
    daily: [],
    topUsers: [],
    tierBreakdown: { free: 0, premium: 0, unlimited: 0 },
    hourlyDistribution: {}
  };

  try {
    // Get all users
    const usersSnap = await getDb().collection('users').get();
    stats.totals.users = usersSnap.size;

    // Count by tier
    usersSnap.forEach(doc => {
      const tier = doc.data().subscriptionTier || 'free';
      stats.tierBreakdown[tier] = (stats.tierBreakdown[tier] || 0) + 1;
    });

    // Aggregate daily usage across all users for the past N days
    const dailyMap = new Map();
    const userTotals = new Map();

    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      if (!stats.period.startDate) stats.period.startDate = dateStr;

      dailyMap.set(dateStr, {
        date: dateStr,
        messages: 0,
        tokens: 0,
        cost: 0,
        activeUsers: 0,
        hourlyMessages: {}
      });
    }

    stats.period.startDate = Array.from(dailyMap.keys()).sort()[0];

    // Query each user's usage for the period
    for (const userDoc of usersSnap.docs) {
      const uid = userDoc.id;
      const usageRef = getDb().collection('users').doc(uid).collection('usage');

      for (const dateStr of dailyMap.keys()) {
        const usageSnap = await usageRef.doc(dateStr).get();

        if (usageSnap.exists) {
          const data = usageSnap.data();
          const dayStats = dailyMap.get(dateStr);

          dayStats.messages += data.messages || 0;
          dayStats.tokens += data.totalTokens || 0;
          dayStats.cost += data.estimatedCost || 0;
          dayStats.activeUsers += 1;

          // Aggregate hourly distribution
          if (data.hourlyMessages) {
            for (const [hour, count] of Object.entries(data.hourlyMessages)) {
              dayStats.hourlyMessages[hour] = (dayStats.hourlyMessages[hour] || 0) + count;
              stats.hourlyDistribution[hour] = (stats.hourlyDistribution[hour] || 0) + count;
            }
          }

          // Track user totals
          const userTotal = userTotals.get(uid) || {
            userId: uid,
            email: userDoc.data().email || 'Unknown',
            displayName: userDoc.data().displayName || 'Unknown',
            tier: userDoc.data().subscriptionTier || 'free',
            messages: 0,
            tokens: 0,
            cost: 0
          };
          userTotal.messages += data.messages || 0;
          userTotal.tokens += data.totalTokens || 0;
          userTotal.cost += data.estimatedCost || 0;
          userTotals.set(uid, userTotal);
        }
      }
    }

    // Convert daily map to sorted array
    stats.daily = Array.from(dailyMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate totals
    for (const day of stats.daily) {
      stats.totals.messages += day.messages;
      stats.totals.tokens += day.tokens;
      stats.totals.cost += day.cost;
    }

    // Get top 10 users by messages
    stats.topUsers = Array.from(userTotals.values())
      .sort((a, b) => b.messages - a.messages)
      .slice(0, 10)
      .map(u => ({
        ...u,
        cost: Math.round(u.cost * 10000) / 10000
      }));

    // Round cost
    stats.totals.cost = Math.round(stats.totals.cost * 10000) / 10000;

    return { success: true, stats };

  } catch (error) {
    console.error('[Admin] Usage stats error:', error);
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Get detailed usage for a specific user (admin only)
 */
const getAdminUserUsage = onCall({
  region: 'us-central1',
  memory: '256MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const adminId = request.auth.uid;

  // Check if user is admin
  const adminRef = getDb().collection('users').doc(adminId);
  const adminSnap = await adminRef.get();
  const adminData = adminSnap.exists ? adminSnap.data() : {};

  if (!adminData.isAdmin && !adminData.role?.includes('admin')) {
    throw new HttpsError('permission-denied', 'Admin access required');
  }

  const { targetUserId, days = 30 } = request.data || {};

  if (!targetUserId) {
    throw new HttpsError('invalid-argument', 'targetUserId required');
  }

  try {
    // Get user info
    const userRef = getDb().collection('users').doc(targetUserId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      throw new HttpsError('not-found', 'User not found');
    }

    const userData = userSnap.data();
    const today = new Date();
    const usage = [];

    // Get daily usage
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const usageSnap = await getDb().collection('users').doc(targetUserId)
        .collection('usage').doc(dateStr).get();

      if (usageSnap.exists) {
        usage.push({
          date: dateStr,
          ...usageSnap.data()
        });
      }
    }

    // Get monthly totals
    const monthlySnap = await getDb().collection('users').doc(targetUserId)
      .collection('usage_monthly')
      .orderBy('month', 'desc')
      .limit(6)
      .get();

    const monthly = monthlySnap.docs.map(doc => ({
      month: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      user: {
        id: targetUserId,
        email: userData.email,
        displayName: userData.displayName,
        tier: userData.subscriptionTier || 'free',
        createdAt: userData.createdAt?.toDate?.()?.toISOString() || null
      },
      usage: usage.sort((a, b) => a.date.localeCompare(b.date)),
      monthly
    };

  } catch (error) {
    console.error('[Admin] User usage error:', error);
    throw new HttpsError('internal', error.message);
  }
});

/**
 * Get list of all users with basic usage info (admin only)
 */
const getAdminUserList = onCall({
  region: 'us-central1',
  memory: '512MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Must be authenticated');
  }

  const adminId = request.auth.uid;

  // Check if user is admin
  const adminRef = getDb().collection('users').doc(adminId);
  const adminSnap = await adminRef.get();
  const adminData = adminSnap.exists ? adminSnap.data() : {};

  if (!adminData.isAdmin && !adminData.role?.includes('admin')) {
    throw new HttpsError('permission-denied', 'Admin access required');
  }

  try {
    const usersSnap = await getDb().collection('users').get();
    const today = new Date().toISOString().split('T')[0];

    const users = [];

    for (const doc of usersSnap.docs) {
      const data = doc.data();

      // Get today's usage
      const usageSnap = await getDb().collection('users').doc(doc.id)
        .collection('usage').doc(today).get();
      const todayUsage = usageSnap.exists ? usageSnap.data() : null;

      // Get profile count
      const profilesSnap = await getDb().collection('users').doc(doc.id)
        .collection('profiles').count().get();

      users.push({
        id: doc.id,
        email: data.email || 'Unknown',
        displayName: data.displayName || 'Unknown',
        tier: data.subscriptionTier || 'free',
        isAdmin: data.isAdmin || false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        lastActive: todayUsage?.lastMessageAt?.toDate?.()?.toISOString() || null,
        profileCount: profilesSnap.data().count,
        todayMessages: todayUsage?.messages || 0,
        todayTokens: todayUsage?.totalTokens || 0,
        todayCost: Math.round((todayUsage?.estimatedCost || 0) * 10000) / 10000
      });
    }

    // Sort by today's messages descending
    users.sort((a, b) => b.todayMessages - a.todayMessages);

    return { success: true, users, total: users.length };

  } catch (error) {
    console.error('[Admin] User list error:', error);
    throw new HttpsError('internal', error.message);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

module.exports = {
  // Cloud Functions
  checkUsageLimits,
  getUsageSummary,
  getAdminUsageStats,
  getAdminUserUsage,
  getAdminUserList,

  // Internal functions (for use by other functions)
  checkRateLimits,
  recordRequestStart,
  recordRequestComplete,
  recordRequestFailed,
  getUserUsageSummary,
  generateRequestId,

  // Constants
  RATE_LIMITS,
  COST_PER_1K_TOKENS
};
