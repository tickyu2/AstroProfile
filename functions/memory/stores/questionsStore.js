/**
 * ============================================================================
 * GENESIS LUNA - QUESTIONS STORE
 * ============================================================================
 * Pending questions for never-ending conversations.
 * Tracks unanswered questions with 5W+H+Soul+Thoughts framework.
 *
 * Functions:
 * - getPendingQuestions: Retrieve unanswered questions
 * - markQuestionAnswered: Update question status when answered
 *
 * Flow:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  QUESTION TRACKING SYSTEM                                               │
 * │                                                                          │
 * │  ┌─────────────────┐                                                     │
 * │  │ REFLECTION      │                                                     │
 * │  │ (extracts       │                                                     │
 * │  │  questions)     │                                                     │
 * │  └────────┬────────┘                                                     │
 * │           │                                                               │
 * │           ▼                                                               │
 * │  ┌─────────────────┐     ┌─────────────────┐                             │
 * │  │ STORE QUESTION  │     │ WITH TIMELINE   │                             │
 * │  │ + Framework     │────▶│ ANCHOR          │                             │
 * │  │ (WHO/WHAT/WHEN) │     │ (if applicable) │                             │
 * │  └─────────────────┘     └─────────────────┘                             │
 * │                                   │                                       │
 * │                                   ▼                                       │
 * │                          ┌─────────────────┐                             │
 * │                          │ RETRIEVE FOR    │                             │
 * │                          │ NATURAL WEAVING │                             │
 * │                          │ INTO CONVO      │                             │
 * │                          └─────────────────┘                             │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Framework Types:
 * - WHO: People involved
 * - WHAT: Events/facts
 * - WHEN: Timing
 * - WHERE: Location
 * - WHY: Motivation
 * - HOW: Process
 * - FEELING: Emotions
 * - THOUGHTS: Decision process
 *
 * Created: December 31, 2025
 * Mission: Best AI Companion Award
 * ============================================================================
 */

const {
  db,
  onCall,
  FieldValue,
  FUNCTION_OPTIONS,
  validateRequired
} = require('../shared');

// ============================================================================
// GET PENDING QUESTIONS
// ============================================================================

/**
 * Retrieve unanswered questions
 * These are woven back naturally when relevant
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {number} limit - Max results
 */
const getPendingQuestions = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, limit = 5 } = request.data;

  validateRequired(request.data, ['userId', 'profileId']);

  try {
    const questionsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('pendingQuestions');

    const snapshot = await questionsRef
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const questions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString()
    }));

    return { success: true, questions };

  } catch (error) {
    console.error('❌ Get pending questions error:', error);
    return { success: true, questions: [] };
  }
});

// ============================================================================
// MARK QUESTION ANSWERED
// ============================================================================

/**
 * Mark a question as answered
 * Called when user answers a pending question
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} questionId - Question document ID
 * @param {string} answer - Optional answer content
 */
const markQuestionAnswered = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, questionId, answer } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'questionId']);

  try {
    const questionRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('pendingQuestions').doc(questionId);

    await questionRef.update({
      status: 'answered',
      answeredAt: FieldValue.serverTimestamp(),
      answer: answer || null
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Mark question answered error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// STORE QUESTION (Used by reflection)
// ============================================================================

/**
 * Store a pending question with optional timeline anchor
 *
 * @param {string} userId - User ID
 * @param {string} profileId - Profile ID
 * @param {string} question - The question content
 * @param {string} framework - Question type (WHO/WHAT/WHEN/WHERE/WHY/HOW/FEELING/THOUGHTS)
 * @param {Object} timelineAnchor - Optional { year, era, event }
 */
const storeQuestion = onCall(FUNCTION_OPTIONS.light, async (request) => {
  const { userId, profileId, question, framework, timelineAnchor } = request.data;

  validateRequired(request.data, ['userId', 'profileId', 'question']);

  try {
    const questionsRef = db
      .collection('users').doc(userId)
      .collection('memory').doc(profileId)
      .collection('pendingQuestions');

    // Use question hash as ID to avoid duplicates
    const questionId = question.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 50);

    await questionsRef.doc(questionId).set({
      question,
      framework: framework || 'WHAT',
      timelineAnchor: timelineAnchor || null,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
      conversationDate: new Date().toISOString().split('T')[0],
      askedCount: FieldValue.increment(1)
    }, { merge: true });

    return { success: true, id: questionId };

  } catch (error) {
    console.error('❌ Store question error:', error);
    return { success: false, error: error.message };
  }
});

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  getPendingQuestions,
  markQuestionAnswered,
  storeQuestion
};
