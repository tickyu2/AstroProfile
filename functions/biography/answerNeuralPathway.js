/**
 * answerNeuralPathway Cloud Function
 *
 * Handles inline answering of neural pathway questions from the sidebar.
 * Saves the answer as a biography memory and marks the question as resolved.
 *
 * Created: December 24, 2025
 */

const { onCall } = require('firebase-functions/v2/https');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firestore
const db = getFirestore();

// PostgreSQL client (optional - imported from parent)
let pgClient = null;
try {
  pgClient = require('../pgClient');
} catch (e) {
  console.log('[Biography] pgClient not available for STM storage');
}

/**
 * Answer a neural pathway question inline (from sidebar)
 * Saves the answer as a biography memory and marks the question as resolved
 */
const answerNeuralPathway = onCall({
  timeoutSeconds: 60,
  memory: '512MiB'
}, async (request) => {
  try {
    const {
      userId,
      profileId,
      questionId,
      questionText,
      answerText,
      theme,
      relatedEventId
    } = request.data;

    if (!userId || !profileId || !questionText || !answerText) {
      return { success: false, error: 'Missing required parameters' };
    }

    console.log('[Biography] answerNeuralPathway:', {
      userId,
      profileId,
      questionText: questionText.slice(0, 50),
      answerLength: answerText.length
    });

    // 1. Save the answer as a new biography memory/life event
    const biographyRef = db
      .collection('users').doc(userId)
      .collection('biography').doc(profileId);

    // Ensure biography doc exists
    const biographyDoc = await biographyRef.get();
    if (!biographyDoc.exists) {
      await biographyRef.set({
        createdAt: new Date(),
        profileId,
        userId
      });
    }

    // Create a new life event from the Q&A
    const eventData = {
      type: theme?.toLowerCase()?.replace(/\s+/g, '_') || 'general',
      title: questionText,
      description: answerText,
      source: 'neural_pathway_answer',
      sourceQuestion: questionText,
      createdAt: new Date(),
      updatedAt: new Date(),
      date: { precision: 'unknown' },
      neural_pathways: [],
      resolved_pathways: [{
        question: questionText,
        answer: answerText,
        resolvedAt: new Date().toISOString()
      }],
      metadata: {
        answeredInline: true,
        theme: theme,
        originalQuestionId: questionId
      }
    };

    // Save as a new life event
    const newEventRef = await biographyRef.collection('life_events').add(eventData);
    console.log('[Biography] Created life event from answer:', newEventRef.id);

    // 2. If related to an existing event, mark it as resolved there too
    if (relatedEventId) {
      try {
        const relatedEventRef = biographyRef.collection('life_events').doc(relatedEventId);
        const relatedEventDoc = await relatedEventRef.get();

        if (relatedEventDoc.exists) {
          const relatedData = relatedEventDoc.data();
          const updatedPathways = (relatedData.neural_pathways || [])
            .filter(q => q !== questionText);

          await relatedEventRef.update({
            neural_pathways: updatedPathways,
            resolved_pathways: [...(relatedData.resolved_pathways || []), {
              question: questionText,
              answer: answerText,
              linkedEventId: newEventRef.id,
              resolvedAt: new Date().toISOString()
            }],
            updatedAt: new Date()
          });
        }
      } catch (linkError) {
        console.warn('[Biography] Could not link to related event:', linkError.message);
      }
    }

    // 3. Also store in STM for immediate chat context
    try {
      if (pgClient && pgClient.storeUserSTM) {
        await pgClient.storeUserSTM({
          userId,
          profileId,
          content: `Q: ${questionText}\nA: ${answerText}`,
          contentType: theme?.toLowerCase() || 'biography',
          importanceScore: 0.7,
          emotionalValence: 0.3,
          emotionalIntensity: 0.3,
          sourceSessionId: 'neural_sidebar',
          sourceMessageRole: 'user'
        });
      }
    } catch (stmError) {
      console.warn('[Biography] Could not store in STM:', stmError.message);
    }

    return {
      success: true,
      eventId: newEventRef.id,
      message: 'Memory saved successfully',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('[Biography] answerNeuralPathway error:', error);
    return { success: false, error: error.message };
  }
});

module.exports = { answerNeuralPathway };
