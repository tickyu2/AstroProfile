/**
 * CCLR Session Service
 *
 * Manages rejuvenation sessions between couples and their Cosmic Love Angels.
 * Handles session creation, updates, angel invitations, and progress tracking.
 */

import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { createSessionDocument } from './schema/firestoreSchema';
import { getAngelCouple } from '../../data/cclr/cosmicLoveAngels';

const SESSIONS_COLLECTION = 'rejuvenation_sessions';

/**
 * Create a new rejuvenation session
 */
export async function createRejuvenationSession({
  partnerA,
  partnerB,
  relationshipType,
  relationshipDuration,
  initialAngelCoupleId
}) {
  try {
    // Get initial angel couple if specified
    let initialAngels = null;
    if (initialAngelCoupleId) {
      const angelCouple = getAngelCouple(initialAngelCoupleId);
      if (angelCouple) {
        initialAngels = {
          coupleId: angelCouple.coupleId,
          coupleName: angelCouple.coupleName,
          angel1: {
            personId: angelCouple.angel1.personId,
            name: angelCouple.angel1.name
          },
          angel2: {
            personId: angelCouple.angel2.personId,
            name: angelCouple.angel2.name
          }
        };
      }
    }

    // Create session document
    const sessionData = createSessionDocument({
      partnerA,
      partnerB,
      relationshipType,
      relationshipDuration,
      initialAngels
    });

    // Add visibleTo for both partners
    sessionData.visibleTo = [partnerA.userId, partnerB.userId];

    // Save to Firestore
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);

    return {
      success: true,
      sessionId: docRef.id,
      session: { ...sessionData, id: docRef.id }
    };
  } catch (error) {
    console.error('Error creating rejuvenation session:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get a session by ID
 */
export async function getSession(sessionId) {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        success: true,
        session: { id: docSnap.id, ...docSnap.data() }
      };
    } else {
      return {
        success: false,
        error: 'Session not found'
      };
    }
  } catch (error) {
    console.error('Error getting session:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all sessions for a user
 */
export async function getUserSessions(userId) {
  try {
    // Query sessions where user is either partnerA or partnerB
    const sessionsRef = collection(db, SESSIONS_COLLECTION);

    // We need to query for both participant positions
    const q = query(
      sessionsRef,
      where('visibleTo', 'array-contains', userId),
      orderBy('lastActive', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const sessions = [];

    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      sessions
    };
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Invite a new angel couple to the session
 */
export async function inviteAngelCouple(sessionId, coupleId, invitedBy) {
  try {
    const angelCouple = getAngelCouple(coupleId);
    if (!angelCouple) {
      return {
        success: false,
        error: `Angel couple ${coupleId} not found`
      };
    }

    // Get current session
    const { session } = await getSession(sessionId);
    if (!session) {
      return {
        success: false,
        error: 'Session not found'
      };
    }

    // Check if already invited
    const alreadyInvited = session.consultedAngels?.some(
      a => a.coupleId === coupleId
    );

    if (alreadyInvited) {
      return {
        success: false,
        error: 'This angel couple has already been invited'
      };
    }

    // Add new angel couple
    const newAngelEntry = {
      coupleId: angelCouple.coupleId,
      coupleName: angelCouple.coupleName,
      invitedBy,
      invitedDate: Timestamp.now(),
      role: 'consultant',
      sessionsLed: 0,
      firstAppearance: Timestamp.now(),
      lastAppearance: Timestamp.now(),
      messageCount: 0,
      topics: [],
      angel1: {
        personId: angelCouple.angel1.personId,
        name: angelCouple.angel1.name,
        messageCount: 0
      },
      angel2: {
        personId: angelCouple.angel2.personId,
        name: angelCouple.angel2.name,
        messageCount: 0
      }
    };

    const updatedAngels = [...(session.consultedAngels || []), newAngelEntry];

    // Update session
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      consultedAngels: updatedAngels,
      updatedAt: serverTimestamp()
    });

    return {
      success: true,
      angelCouple: newAngelEntry
    };
  } catch (error) {
    console.error('Error inviting angel couple:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Update angel statistics after a message
 */
export async function updateAngelStats(sessionId, coupleId, personId, topics = []) {
  try {
    const { session } = await getSession(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    const updatedAngels = session.consultedAngels.map(angel => {
      if (angel.coupleId === coupleId) {
        // Update couple stats
        const updatedAngelEntry = {
          ...angel,
          lastAppearance: Timestamp.now(),
          messageCount: (angel.messageCount || 0) + 1,
          topics: [...new Set([...(angel.topics || []), ...topics])]
        };

        // Update individual angel stats
        if (personId === angel.angel1.personId) {
          updatedAngelEntry.angel1 = {
            ...angel.angel1,
            messageCount: (angel.angel1.messageCount || 0) + 1
          };
        } else if (personId === angel.angel2.personId) {
          updatedAngelEntry.angel2 = {
            ...angel.angel2,
            messageCount: (angel.angel2.messageCount || 0) + 1
          };
        }

        return updatedAngelEntry;
      }
      return angel;
    });

    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      consultedAngels: updatedAngels,
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating angel stats:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update session with new data
 */
export async function updateSession(sessionId, updates) {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating session:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save initial assessment
 */
export async function saveInitialAssessment(sessionId, assessment) {
  try {
    const { session } = await getSession(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    const initialAssessment = {
      date: Timestamp.now(),
      loveLevel: assessment.loveLevel,
      compassionLevel: assessment.compassionLevel,
      connectionLevel: assessment.connectionLevel,
      notes: assessment.notes || ''
    };

    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      'progressTracking.initialAssessment': initialAssessment,
      updatedAt: serverTimestamp()
    });

    return { success: true, assessment: initialAssessment };
  } catch (error) {
    console.error('Error saving initial assessment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add a monthly check-in
 */
export async function addMonthlyCheckin(sessionId, checkin) {
  try {
    const { session } = await getSession(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    const newCheckin = {
      date: Timestamp.now(),
      loveLevel: checkin.loveLevel,
      compassionLevel: checkin.compassionLevel,
      connectionLevel: checkin.connectionLevel,
      improvements: checkin.improvements || [],
      challenges: checkin.challenges || [],
      notes: checkin.notes || ''
    };

    const monthlyCheckins = [
      ...(session.progressTracking?.monthlyCheckins || []),
      newCheckin
    ];

    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      'progressTracking.monthlyCheckins': monthlyCheckins,
      updatedAt: serverTimestamp()
    });

    return { success: true, checkin: newCheckin };
  } catch (error) {
    console.error('Error adding monthly checkin:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Set rejuvenation plan
 */
export async function setRejuvenationPlan(sessionId, plan) {
  try {
    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      rejuvenationPlan: {
        duration: plan.duration || '3 months',
        frequency: plan.frequency || 'Monthly check-ins + as-needed',
        focus: plan.focus || '',
        milestones: plan.milestones || []
      },
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error setting rejuvenation plan:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Add timeline event
 */
export async function addTimelineEvent(sessionId, event) {
  try {
    const { session } = await getSession(sessionId);
    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    const newEvent = {
      date: Timestamp.now(),
      type: event.type, // "formal_session" | "consultation" | "async_update"
      couple: event.couple || null,
      messagesCount: event.messagesCount || 0,
      summary: event.summary || ''
    };

    const timeline = [...(session.timeline || []), newEvent];

    const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await updateDoc(docRef, {
      timeline,
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, event: newEvent };
  } catch (error) {
    console.error('Error adding timeline event:', error);
    return { success: false, error: error.message };
  }
}

export default {
  createRejuvenationSession,
  getSession,
  getUserSessions,
  inviteAngelCouple,
  updateAngelStats,
  updateSession,
  saveInitialAssessment,
  addMonthlyCheckin,
  setRejuvenationPlan,
  addTimelineEvent
};
