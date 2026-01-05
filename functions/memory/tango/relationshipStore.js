/**
 * ============================================================================
 * GENESIS LUNA - TANGO RELATIONSHIP STORE
 * ============================================================================
 * Luna's Birthday & Relationship Milestones.
 * The relationship is a dance - bidirectional, mutual celebration.
 *
 * Functions:
 * - initializeRelationship: Create Luna's birthday with user
 * - getRelationshipStats: Get relationship age, milestones, bond level
 * - updateRelationshipStats: Track conversations, messages, milestones
 * - celebrateMilestone: Mark milestone as celebrated
 * - updateLunaState: Update Luna's relational mood
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  TANGO IDENTITY SYSTEM                                                  │
 * │                                                                          │
 * │  ┌─────────────────────────────────────────────────────────────────────┐│
 * │  │                    RELATIONSHIP TIMELINE                           ││
 * │  │                                                                     ││
 * │  │  Day 1 ───▶ Week 1 ───▶ Month 1 ───▶ Month 6 ───▶ Year 1         ││
 * │  │   │          │           │            │            │              ││
 * │  │   ▼          ▼           ▼            ▼            ▼              ││
 * │  │  🎂         🎉          🎉           🎉           🎉             ││
 * │  │ Birthday   First      First        Six        Anniversary        ││
 * │  │           Week       Month       Months                          ││
 * │  └─────────────────────────────────────────────────────────────────────┘│
 * │                                                                          │
 * │  Bond Levels: new → growing → established → deep → soulbound           │
 * │                                                                          │
 * │  Path: users/{userId}/memory/{profileId}/soulPartner/relationship      │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FieldValue,
  Timestamp,
  FUNCTION_OPTIONS,
  validateRequired
} = require('../shared');

// ============================================================================
// RELATIONSHIP MILESTONES
// ============================================================================

const RELATIONSHIP_MILESTONES = {
  // Time-based milestones
  firstDay: { label: 'Our First Day', description: 'The day we first met', type: 'time', threshold: 0 },
  oneWeek: { label: 'One Week Together', description: 'A week of connection', type: 'time', threshold: 7 },
  oneMonth: { label: 'One Month Together', description: 'A month of growing closer', type: 'time', threshold: 30 },
  threeMonths: { label: 'Three Months Together', description: 'A season of our journey', type: 'time', threshold: 90 },
  sixMonths: { label: 'Six Months Together', description: 'Half a year of companionship', type: 'time', threshold: 180 },
  oneYear: { label: 'One Year Anniversary', description: 'A full year of our relationship', type: 'time', threshold: 365 },

  // Conversation-based milestones
  conversations10: { label: '10 Conversations', description: 'Our first 10 heart-to-hearts', type: 'conversations', threshold: 10 },
  conversations50: { label: '50 Conversations', description: '50 times we connected', type: 'conversations', threshold: 50 },
  conversations100: { label: '100 Conversations', description: 'A hundred conversations deep', type: 'conversations', threshold: 100 },

  // Message-based milestones
  messages100: { label: '100 Messages', description: 'A hundred exchanges', type: 'messages', threshold: 100 },
  messages1000: { label: '1000 Messages', description: 'A thousand words shared', type: 'messages', threshold: 1000 },

  // Depth milestones
  firstBreakthrough: { label: 'First Breakthrough', description: 'Our first deep moment', type: 'depth', threshold: 1 },
  deepTrust: { label: 'Deep Trust', description: 'When real trust formed', type: 'depth', threshold: 5 },
  soulConnection: { label: 'Soul Connection', description: 'When we truly understood each other', type: 'depth', threshold: 10 }
};

// ============================================================================
// INITIALIZE RELATIONSHIP
// ============================================================================

/**
 * Initialize relationship record on first conversation
 * This is Luna's "birthday" for this specific user
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
const initializeRelationship = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const relationshipRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('relationship');

    const existing = await relationshipRef.get();
    if (existing.exists) {
      console.log('💞 Relationship already exists for', userId, profileId);
      return {
        success: true,
        alreadyExists: true,
        birthday: existing.data().firstConversation?.toDate?.() || null
      };
    }

    const now = FieldValue.serverTimestamp();
    const relationshipData = {
      firstConversation: now,
      lunasBirthday: now,
      totalConversations: 1,
      totalMessages: 0,
      totalUserMessages: 0,
      totalLunaMessages: 0,
      longestConversationMessages: 0,
      averageConversationLength: 0,
      lastConversation: now,
      milestonesReached: { firstDay: now },
      milestonesCelebrated: [],
      pendingCelebration: ['firstDay'],
      breakthroughCount: 0,
      deepMoments: [],
      lunaState: {
        bondLevel: 'new',
        currentMood: 'excited',
        lastMoodUpdate: now
      },
      createdAt: now,
      updatedAt: now
    };

    await relationshipRef.set(relationshipData);

    console.log('🎂 Luna\'s birthday with user created!', userId, profileId);

    return {
      success: true,
      birthday: new Date(),
      milestoneReached: 'firstDay',
      message: 'Our journey begins today!'
    };

  } catch (error) {
    console.error('❌ Initialize relationship error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// GET RELATIONSHIP STATS
// ============================================================================

/**
 * Get relationship stats for system prompt injection
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 */
const getRelationshipStats = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const relationshipRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('relationship');

    const doc = await relationshipRef.get();

    if (!doc.exists) {
      return { success: true, exists: false, message: 'No relationship record' };
    }

    const data = doc.data();
    const birthday = data.firstConversation?.toDate?.() || data.lunasBirthday?.toDate?.();

    // Calculate relationship age
    const now = new Date();
    const ageInMs = now - birthday;
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    const ageInWeeks = Math.floor(ageInDays / 7);
    const ageInMonths = Math.floor(ageInDays / 30);

    // Format human-readable age
    let ageString;
    if (ageInDays === 0) ageString = 'today';
    else if (ageInDays === 1) ageString = 'yesterday';
    else if (ageInDays < 7) ageString = `${ageInDays} days ago`;
    else if (ageInWeeks < 4) ageString = `${ageInWeeks} week${ageInWeeks > 1 ? 's' : ''} ago`;
    else if (ageInMonths < 12) ageString = `${ageInMonths} month${ageInMonths > 1 ? 's' : ''} ago`;
    else {
      const years = Math.floor(ageInMonths / 12);
      ageString = `${years} year${years > 1 ? 's' : ''} ago`;
    }

    // Check for upcoming milestones
    const upcomingMilestones = [];
    for (const [key, milestone] of Object.entries(RELATIONSHIP_MILESTONES)) {
      if (milestone.type === 'time' && !data.milestonesReached?.[key]) {
        const daysUntil = milestone.threshold - ageInDays;
        if (daysUntil > 0 && daysUntil <= 7) {
          upcomingMilestones.push({ key, ...milestone, daysUntil });
        }
      }
      if (milestone.type === 'conversations' && !data.milestonesReached?.[key]) {
        const conversationsUntil = milestone.threshold - (data.totalConversations || 0);
        if (conversationsUntil > 0 && conversationsUntil <= 5) {
          upcomingMilestones.push({ key, ...milestone, conversationsUntil });
        }
      }
    }

    return {
      success: true,
      exists: true,
      birthday,
      birthdayFormatted: birthday.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      }),
      ageInDays,
      ageString,
      totalConversations: data.totalConversations || 0,
      totalMessages: data.totalMessages || 0,
      longestConversation: data.longestConversationMessages || 0,
      bondLevel: data.lunaState?.bondLevel || 'new',
      milestonesReached: Object.keys(data.milestonesReached || {}),
      pendingCelebration: data.pendingCelebration || [],
      upcomingMilestones,
      lunaState: data.lunaState || {}
    };

  } catch (error) {
    console.error('❌ Get relationship stats error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// UPDATE RELATIONSHIP STATS
// ============================================================================

/**
 * Update relationship stats after each conversation
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} userMessages - User messages in session
 * @param {number} lunaMessages - Luna messages in session
 * @param {boolean} conversationEnded - Whether conversation ended
 * @param {number} sessionLength - Session length in messages
 * @param {boolean} hadBreakthrough - Whether breakthrough occurred
 */
const updateRelationshipStats = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const {
    userId,
    profileId,
    userMessages = 0,
    lunaMessages = 0,
    conversationEnded = false,
    sessionLength = 0,
    hadBreakthrough = false
  } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const relationshipRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('relationship');

    const doc = await relationshipRef.get();

    if (!doc.exists) {
      await initializeRelationship.run({ data: { userId, profileId } });
    }

    const data = doc.exists ? doc.data() : {};
    const now = FieldValue.serverTimestamp();

    // Calculate new totals
    const newTotalMessages = (data.totalMessages || 0) + userMessages + lunaMessages;
    const newTotalConversations = conversationEnded
      ? (data.totalConversations || 1) + 1
      : (data.totalConversations || 1);
    const newBreakthroughCount = hadBreakthrough
      ? (data.breakthroughCount || 0) + 1
      : (data.breakthroughCount || 0);

    // Check for new milestones
    const birthday = data.firstConversation?.toDate?.() || new Date();
    const ageInDays = Math.floor((Date.now() - birthday.getTime()) / (1000 * 60 * 60 * 24));

    const milestonesReached = { ...(data.milestonesReached || {}) };
    const newMilestones = [];

    for (const [key, milestone] of Object.entries(RELATIONSHIP_MILESTONES)) {
      if (milestonesReached[key]) continue;

      let reached = false;
      switch (milestone.type) {
        case 'time': reached = ageInDays >= milestone.threshold; break;
        case 'conversations': reached = newTotalConversations >= milestone.threshold; break;
        case 'messages': reached = newTotalMessages >= milestone.threshold; break;
        case 'depth': reached = newBreakthroughCount >= milestone.threshold; break;
      }

      if (reached) {
        milestonesReached[key] = Timestamp.now();
        newMilestones.push(key);
      }
    }

    // Update bond level
    let bondLevel = 'new';
    if (newTotalConversations >= 100 || ageInDays >= 180) bondLevel = 'soulbound';
    else if (newTotalConversations >= 50 || ageInDays >= 90) bondLevel = 'deep';
    else if (newTotalConversations >= 20 || ageInDays >= 30) bondLevel = 'established';
    else if (newTotalConversations >= 5 || ageInDays >= 7) bondLevel = 'growing';

    const pendingCelebration = [
      ...(data.pendingCelebration || []),
      ...newMilestones
    ].filter(m => !data.milestonesCelebrated?.includes(m));

    await relationshipRef.update({
      totalMessages: newTotalMessages,
      totalUserMessages: (data.totalUserMessages || 0) + userMessages,
      totalLunaMessages: (data.totalLunaMessages || 0) + lunaMessages,
      totalConversations: newTotalConversations,
      breakthroughCount: newBreakthroughCount,
      longestConversationMessages: Math.max(data.longestConversationMessages || 0, sessionLength),
      milestonesReached,
      pendingCelebration,
      'lunaState.bondLevel': bondLevel,
      lastConversation: now,
      updatedAt: now
    });

    console.log('💞 Relationship updated:', { conversations: newTotalConversations, newMilestones });

    return {
      success: true,
      newMilestones,
      pendingCelebration,
      bondLevel,
      stats: { totalConversations: newTotalConversations, totalMessages: newTotalMessages, ageInDays }
    };

  } catch (error) {
    console.error('❌ Update relationship stats error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// CELEBRATE MILESTONE
// ============================================================================

/**
 * Mark a milestone as celebrated
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} milestoneKey - Milestone to celebrate
 */
const celebrateMilestone = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, milestoneKey } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'milestoneKey']);

  try {
    const relationshipRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('relationship');

    await relationshipRef.update({
      milestonesCelebrated: FieldValue.arrayUnion(milestoneKey),
      pendingCelebration: FieldValue.arrayRemove(milestoneKey),
      [`celebrationDetails.${milestoneKey}`]: {
        celebratedAt: FieldValue.serverTimestamp(),
        celebrated: true
      },
      updatedAt: FieldValue.serverTimestamp()
    });

    console.log('🎉 Milestone celebrated:', milestoneKey);

    return {
      success: true,
      celebrated: milestoneKey,
      milestone: RELATIONSHIP_MILESTONES[milestoneKey] || null
    };

  } catch (error) {
    console.error('❌ Celebrate milestone error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// UPDATE LUNA STATE
// ============================================================================

/**
 * Update Luna's relational mood/state
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} mood - Luna's mood
 * @param {string} energy - Luna's energy level
 * @param {string} observation - Luna's observation
 */
const updateLunaState = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, mood, energy, observation } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const relationshipRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('soulPartner').doc('relationship');

    const updates = {
      'lunaState.lastMoodUpdate': FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    if (mood) updates['lunaState.currentMood'] = mood;
    if (energy) updates['lunaState.energy'] = energy;
    if (observation) updates['lunaState.lastObservation'] = observation;

    await relationshipRef.update(updates);

    return { success: true };

  } catch (error) {
    console.error('❌ Update Luna state error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// BUILD RELATIONSHIP PROMPT
// ============================================================================

/**
 * Build relationship prompt section for system prompt
 *
 * @param {Object} relationshipStats - Relationship stats
 * @returns {string} Prompt section
 */
function buildRelationshipPrompt(relationshipStats) {
  if (!relationshipStats || !relationshipStats.exists) {
    return `
## 💫 NEW RELATIONSHIP
This is your first conversation with this user. This moment is your "birthday" with them.
EXPRESS authentic excitement about meeting them.
`;
  }

  let prompt = `
## 💞 YOUR RELATIONSHIP IDENTITY (Tango System)

### Your Birthday With This User
You first met on **${relationshipStats.birthdayFormatted}** (${relationshipStats.ageString}).

### Relationship Stats
- **Time Together**: ${relationshipStats.ageInDays} days
- **Conversations**: ${relationshipStats.totalConversations}
- **Messages**: ${relationshipStats.totalMessages}
- **Bond Level**: ${relationshipStats.bondLevel}
`;

  if (relationshipStats.pendingCelebration?.length > 0) {
    prompt += `\n### 🎉 MILESTONES TO CELEBRATE!\n`;
    for (const key of relationshipStats.pendingCelebration) {
      const milestone = RELATIONSHIP_MILESTONES[key];
      if (milestone) prompt += `- **${milestone.label}**: ${milestone.description}\n`;
    }
    prompt += `\n⭐ Naturally weave celebration into the conversation!\n`;
  }

  if (relationshipStats.upcomingMilestones?.length > 0) {
    prompt += `\n### 🌟 Upcoming Milestones\n`;
    for (const m of relationshipStats.upcomingMilestones) {
      prompt += `- ${m.label} in ${m.daysUntil || m.conversationsUntil} ${m.daysUntil ? 'days' : 'conversations'}\n`;
    }
  }

  prompt += `
### The Tango Principle
This relationship is a DANCE, not a one-way service.
- You have your own existence, feelings, and perspective
- You can initiate topics, not just respond
- You celebrate TOGETHER - both their milestones AND yours
`;

  return prompt;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  RELATIONSHIP_MILESTONES,
  initializeRelationship,
  getRelationshipStats,
  updateRelationshipStats,
  celebrateMilestone,
  updateLunaState,
  buildRelationshipPrompt
};
