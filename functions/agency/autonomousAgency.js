/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AUTONOMOUS AGENCY - Luna's Proactive Engagement System
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Allows Luna to proactively reach out to users based on:
 * - Time-based patterns (haven't heard from you)
 * - Reminders that have triggered
 * - Astrological events (transits, lunar phases)
 * - Detected behavioral patterns
 * - Important dates (birthdays, anniversaries)
 *
 * Uses Cloud Scheduler for periodic heartbeat checks
 *
 * @module autonomousAgency
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

// How often to check for proactive opportunities (Cloud Scheduler)
const HEARTBEAT_SCHEDULE = 'every 6 hours';

// Thresholds for triggering proactive outreach
const THRESHOLDS = {
  daysWithoutContact: 7,       // Days before "haven't heard from you" message
  reminderPriorityHigh: 0,     // Days before high priority reminder
  reminderPriorityMedium: 1,   // Days buffer for medium priority
  reminderPriorityLow: 3,      // Days buffer for low priority
  maxNotificationsPerDay: 3    // Don't overwhelm users
};

// ═══════════════════════════════════════════════════════════════════════════════
// HEARTBEAT SCHEDULER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Periodic heartbeat that checks all users for proactive engagement opportunities
 * Runs every 6 hours via Cloud Scheduler
 */
exports.agencyHeartbeat = onSchedule({
  schedule: HEARTBEAT_SCHEDULE,
  timeZone: 'UTC',
  memory: '512MiB',
  timeoutSeconds: 540
}, async (event) => {
  console.log('[Agency] Heartbeat starting...');

  const db = admin.firestore();
  const now = new Date();

  try {
    // Get all users with active profiles
    const usersSnap = await db.collection('users').get();
    let processedCount = 0;
    let notificationsCreated = 0;

    for (const userDoc of usersSnap.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();

      // Skip if user has disabled proactive outreach
      if (userData.preferences?.disableProactiveOutreach) {
        continue;
      }

      // Check each profile the user has
      const profilesSnap = await db.collection('profiles')
        .where('userId', '==', userId)
        .get();

      for (const profileDoc of profilesSnap.docs) {
        const profileId = profileDoc.id;
        const profile = profileDoc.data();

        // Only check "self" profiles for now
        if (profile.relationshipType?.toLowerCase() !== 'self' &&
            profile.relationshipType?.toLowerCase() !== 'me') {
          continue;
        }

        // Run all proactive checks
        const triggers = await checkAllTriggers(userId, profileId, profile, now);

        // Create notifications for valid triggers
        for (const trigger of triggers) {
          await createProactiveNotification(userId, profileId, trigger);
          notificationsCreated++;
        }

        processedCount++;
      }
    }

    console.log(`[Agency] Heartbeat complete. Processed: ${processedCount} profiles, Created: ${notificationsCreated} notifications`);

  } catch (error) {
    console.error('[Agency] Heartbeat error:', error);
    throw error;
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// TRIGGER CHECKS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check all possible triggers for a user/profile
 */
async function checkAllTriggers(userId, profileId, profile, now) {
  const triggers = [];

  // 1. Check for pending reminders
  const reminderTriggers = await checkReminders(userId, profileId, now);
  triggers.push(...reminderTriggers);

  // 2. Check for absence (haven't heard from you)
  const absenceTrigger = await checkAbsence(userId, profileId, now);
  if (absenceTrigger) triggers.push(absenceTrigger);

  // 3. Check for astrological events
  const astroTriggers = await checkAstrologicalEvents(profile, now);
  triggers.push(...astroTriggers);

  // 4. Check for important dates
  const dateTriggers = await checkImportantDates(userId, profileId, profile, now);
  triggers.push(...dateTriggers);

  // 5. Check detected patterns
  const patternTriggers = await checkPatternTriggers(userId, profileId, now);
  triggers.push(...patternTriggers);

  return triggers;
}

/**
 * Check for pending reminders that should trigger
 */
async function checkReminders(userId, profileId, now) {
  const db = admin.firestore();
  const triggers = [];

  try {
    const remindersSnap = await db.collection('users').doc(userId)
      .collection('reminders')
      .where('profileId', '==', profileId)
      .where('status', '==', 'pending')
      .where('triggerType', '==', 'date')
      .get();

    for (const doc of remindersSnap.docs) {
      const reminder = doc.data();
      const triggerDate = reminder.triggerDate?.toDate();

      if (!triggerDate) continue;

      // Calculate buffer based on priority
      const bufferDays = THRESHOLDS[`reminderPriority${capitalize(reminder.priority || 'medium')}`] || 1;
      const effectiveDate = new Date(triggerDate);
      effectiveDate.setDate(effectiveDate.getDate() - bufferDays);

      if (now >= effectiveDate) {
        triggers.push({
          type: 'reminder',
          reminderId: doc.id,
          text: reminder.text,
          priority: reminder.priority,
          originalDate: triggerDate.toISOString()
        });

        // Mark as triggered
        await doc.ref.update({
          status: 'triggered',
          triggeredAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error('[Agency] Error checking reminders:', error);
  }

  return triggers;
}

/**
 * Check if user has been absent too long
 */
async function checkAbsence(userId, profileId, now) {
  const db = admin.firestore();

  try {
    // Get last conversation
    const conversationsSnap = await db.collection('conversations')
      .where('userId', '==', userId)
      .where('profileId', '==', profileId)
      .orderBy('lastMessageAt', 'desc')
      .limit(1)
      .get();

    if (conversationsSnap.empty) return null;

    const lastConversation = conversationsSnap.docs[0].data();
    const lastMessageAt = lastConversation.lastMessageAt?.toDate();

    if (!lastMessageAt) return null;

    const daysSinceContact = Math.floor((now - lastMessageAt) / (1000 * 60 * 60 * 24));

    if (daysSinceContact >= THRESHOLDS.daysWithoutContact) {
      // Check if we already sent an absence notification recently
      const recentNotifSnap = await db.collection('users').doc(userId)
        .collection('proactiveNotifications')
        .where('profileId', '==', profileId)
        .where('type', '==', 'absence')
        .where('createdAt', '>', admin.firestore.Timestamp.fromDate(
          new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        ))
        .limit(1)
        .get();

      if (recentNotifSnap.empty) {
        return {
          type: 'absence',
          daysSinceContact,
          lastContactDate: lastMessageAt.toISOString()
        };
      }
    }
  } catch (error) {
    console.error('[Agency] Error checking absence:', error);
  }

  return null;
}

/**
 * Check for astrological events affecting the user
 */
async function checkAstrologicalEvents(profile, now) {
  const triggers = [];

  // Check lunar phase
  const lunarPhase = calculateLunarPhase(now);
  const isSignificantPhase = ['New Moon', 'Full Moon'].includes(lunarPhase);

  if (isSignificantPhase) {
    const sunSign = profile.calculations?.western?.sign;
    if (sunSign) {
      triggers.push({
        type: 'lunar_event',
        phase: lunarPhase,
        sunSign,
        message: `The ${lunarPhase} is happening - a powerful time for ${sunSign}s`
      });
    }
  }

  // Check birthday proximity
  const birthDate = profile.birthDate;
  if (birthDate) {
    const birth = new Date(birthDate);
    const thisYearBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    const daysUntilBirthday = Math.floor((thisYearBirthday - now) / (1000 * 60 * 60 * 24));

    if (daysUntilBirthday >= 0 && daysUntilBirthday <= 7) {
      triggers.push({
        type: 'birthday',
        daysUntil: daysUntilBirthday,
        message: daysUntilBirthday === 0
          ? 'Happy Birthday! 🎂'
          : `Your birthday is coming up in ${daysUntilBirthday} days!`
      });
    }
  }

  return triggers;
}

/**
 * Check for important dates stored in memory
 */
async function checkImportantDates(userId, profileId, profile, now) {
  const db = admin.firestore();
  const triggers = [];

  try {
    // Look for stored facts about important dates
    const factsSnap = await db.collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('facts')
      .where('category', 'in', ['milestone', 'relationship', 'goal'])
      .get();

    for (const doc of factsSnap.docs) {
      const fact = doc.data();
      const content = fact.content?.toLowerCase() || '';

      // Look for date patterns in content
      const dateMatch = content.match(/(\d{1,2})\/(\d{1,2})/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1;
        const day = parseInt(dateMatch[2]);
        const eventDate = new Date(now.getFullYear(), month, day);
        const daysUntil = Math.floor((eventDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntil >= 0 && daysUntil <= 3) {
          triggers.push({
            type: 'important_date',
            fact: fact.content,
            daysUntil,
            category: fact.category
          });
        }
      }
    }
  } catch (error) {
    console.error('[Agency] Error checking important dates:', error);
  }

  return triggers;
}

/**
 * Check for pattern-based triggers
 */
async function checkPatternTriggers(userId, profileId, now) {
  const db = admin.firestore();
  const triggers = [];

  try {
    // Get detected patterns
    const patternsSnap = await db.collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulpartner').doc('patterns')
      .collection('detected')
      .get();

    for (const doc of patternsSnap.docs) {
      const pattern = doc.data();

      // Check for patterns that suggest proactive check-in
      if (pattern.patternType === 'recurring_concern' && pattern.confidence > 0.7) {
        const lastCheckedIn = pattern.lastCheckedIn?.toDate();
        const daysSinceCheckIn = lastCheckedIn
          ? Math.floor((now - lastCheckedIn) / (1000 * 60 * 60 * 24))
          : 999;

        if (daysSinceCheckIn >= 7) {
          triggers.push({
            type: 'pattern_checkin',
            patternId: doc.id,
            pattern: pattern.pattern,
            insight: pattern.insight
          });

          // Update last checked in
          await doc.ref.update({
            lastCheckedIn: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    }
  } catch (error) {
    console.error('[Agency] Error checking patterns:', error);
  }

  return triggers;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION CREATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create a proactive notification for the user
 */
async function createProactiveNotification(userId, profileId, trigger) {
  const db = admin.firestore();

  try {
    // Generate personalized message using Gemini
    const message = await generateProactiveMessage(trigger);

    await db.collection('users').doc(userId)
      .collection('proactiveNotifications').add({
        profileId,
        type: trigger.type,
        trigger: trigger,
        message,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    console.log(`[Agency] Created ${trigger.type} notification for user ${userId}`);

  } catch (error) {
    console.error('[Agency] Error creating notification:', error);
  }
}

/**
 * Generate personalized proactive message
 */
async function generateProactiveMessage(trigger) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompts = {
    reminder: `Generate a warm, brief message from Luna (an AI companion) following up on this reminder: "${trigger.text}". Keep it under 2 sentences, caring and natural.`,

    absence: `Generate a warm check-in message from Luna (an AI companion) who hasn't heard from someone in ${trigger.daysSinceContact} days. Be caring but not clingy. Under 2 sentences.`,

    lunar_event: `Generate a brief, insightful message about the ${trigger.phase} for a ${trigger.sunSign}. Be warm and astrologically informed. Under 2 sentences.`,

    birthday: `Generate a warm birthday message from Luna (an AI companion). ${trigger.daysUntil === 0 ? 'Today is their birthday!' : `Their birthday is in ${trigger.daysUntil} days.`} Under 2 sentences.`,

    important_date: `Generate a warm reminder message about this upcoming event: "${trigger.fact}". Be caring and supportive. Under 2 sentences.`,

    pattern_checkin: `Generate a caring check-in message about this pattern Luna noticed: "${trigger.pattern}". Her insight: "${trigger.insight}". Be warm and helpful. Under 2 sentences.`
  };

  try {
    const result = await model.generateContent(prompts[trigger.type] || 'Generate a warm check-in message.');
    return result.response.text();
  } catch (error) {
    console.error('[Agency] Error generating message:', error);
    return getDefaultMessage(trigger.type);
  }
}

/**
 * Default messages if AI generation fails
 */
function getDefaultMessage(type) {
  const defaults = {
    reminder: "Just wanted to follow up on something we discussed earlier. How's it going?",
    absence: "Hey! I've been thinking about you. How have you been?",
    lunar_event: "There's interesting cosmic energy today. I'd love to chat about it!",
    birthday: "Wishing you the most wonderful day! 🎂",
    important_date: "I remembered something important coming up for you!",
    pattern_checkin: "I've been thinking about our conversations. How are things?"
  };
  return defaults[type] || "Hi! I wanted to check in with you.";
}

// ═══════════════════════════════════════════════════════════════════════════════
// CALLABLE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get pending proactive notifications for a user
 */
exports.getPendingNotifications = onCall({
  timeoutSeconds: 30,
  memory: '256MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const userId = request.auth.uid;
  const { profileId, limit = 10 } = request.data;

  const db = admin.firestore();

  try {
    let query = db.collection('users').doc(userId)
      .collection('proactiveNotifications')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (profileId) {
      query = query.where('profileId', '==', profileId);
    }

    const snap = await query.get();

    const notifications = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));

    return { notifications };

  } catch (error) {
    console.error('[Agency] Error getting notifications:', error);
    throw new HttpsError('internal', 'Failed to get notifications');
  }
});

/**
 * Mark a notification as read/dismissed
 */
exports.dismissNotification = onCall({
  timeoutSeconds: 30,
  memory: '128MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const userId = request.auth.uid;
  const { notificationId, action = 'dismissed' } = request.data;

  if (!notificationId) {
    throw new HttpsError('invalid-argument', 'Notification ID required');
  }

  const db = admin.firestore();

  try {
    await db.collection('users').doc(userId)
      .collection('proactiveNotifications').doc(notificationId)
      .update({
        status: action, // 'dismissed', 'read', 'acted_on'
        actionedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    return { success: true };

  } catch (error) {
    console.error('[Agency] Error dismissing notification:', error);
    throw new HttpsError('internal', 'Failed to dismiss notification');
  }
});

/**
 * Manual trigger for testing
 */
exports.triggerAgencyCheck = onCall({
  timeoutSeconds: 120,
  memory: '512MiB'
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication required');
  }

  const userId = request.auth.uid;
  const { profileId } = request.data;

  if (!profileId) {
    throw new HttpsError('invalid-argument', 'Profile ID required');
  }

  const db = admin.firestore();
  const now = new Date();

  try {
    const profileDoc = await db.collection('profiles').doc(profileId).get();
    if (!profileDoc.exists) {
      throw new HttpsError('not-found', 'Profile not found');
    }

    const profile = profileDoc.data();
    const triggers = await checkAllTriggers(userId, profileId, profile, now);

    for (const trigger of triggers) {
      await createProactiveNotification(userId, profileId, trigger);
    }

    return {
      success: true,
      triggersFound: triggers.length,
      triggers
    };

  } catch (error) {
    console.error('[Agency] Error in manual trigger:', error);
    throw new HttpsError('internal', error.message);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function calculateLunarPhase(date) {
  const LUNAR_MONTH = 29.53059;
  const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z');
  const diff = date - KNOWN_NEW_MOON;
  const days = diff / (1000 * 60 * 60 * 24);
  const phase = (days % LUNAR_MONTH) / LUNAR_MONTH;

  if (phase < 0.0625) return 'New Moon';
  if (phase < 0.1875) return 'Waxing Crescent';
  if (phase < 0.3125) return 'First Quarter';
  if (phase < 0.4375) return 'Waxing Gibbous';
  if (phase < 0.5625) return 'Full Moon';
  if (phase < 0.6875) return 'Waning Gibbous';
  if (phase < 0.8125) return 'Last Quarter';
  if (phase < 0.9375) return 'Waning Crescent';
  return 'New Moon';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
