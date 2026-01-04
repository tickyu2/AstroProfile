/**
 * CCLR (Couples Cosmic Love Rejuvenation) Service
 *
 * Provides all Firebase operations for CCLR sessions:
 * - Session CRUD operations
 * - Message handling with real-time subscriptions
 * - Progress tracking
 * - Angel couple management
 */

import { db } from '../../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Helper to get current timestamp for arrays (serverTimestamp doesn't work in arrays)
const now = () => Timestamp.now();

// Re-export angel couple functions from data layer
export {
  getAngelCouple,
  getAllAngelCouples,
  recommendAngelCouple,
  getAngelCouplesBySpecialty,
  searchAngelCouples
} from '../../data/cclr/cosmicLoveAngels';

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Create a new CCLR rejuvenation session
 */
export async function createRejuvenationSession({
  partnerA,
  partnerB,
  relationshipType,
  relationshipDuration,
  initialAngelCoupleId
}) {
  try {
    const sessionData = {
      // Participants
      participants: {
        partnerA: {
          userId: partnerA.userId,
          name: partnerA.name,
          constitution: partnerA.constitution || null,
          joinedAt: serverTimestamp()
        },
        partnerB: {
          userId: partnerB.userId || null,
          name: partnerB.name,
          email: partnerB.email || null,
          constitution: partnerB.constitution || null,
          joinedAt: partnerB.userId ? serverTimestamp() : null,
          inviteStatus: partnerB.userId ? 'joined' : 'pending'
        }
      },

      // Relationship info
      relationshipName: `${partnerA.name} & ${partnerB.name}`,
      relationshipType,
      relationshipDuration,

      // Angel guidance (use Timestamp.now() since serverTimestamp doesn't work in arrays)
      consultedAngels: initialAngelCoupleId ? [{
        coupleId: initialAngelCoupleId,
        invitedAt: now(),
        conversationCount: 0
      }] : [],

      // Progress tracking
      progressTracking: {
        initialAssessment: null,
        currentAssessment: null,
        assessmentHistory: []
      },

      // Session metadata
      status: 'active',
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      messageCount: 0
    };

    const docRef = await addDoc(collection(db, 'rejuvenation_sessions'), sessionData);

    return {
      success: true,
      sessionId: docRef.id
    };
  } catch (error) {
    console.error('Error creating session:', error);
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
    const docRef = doc(db, 'rejuvenation_sessions', sessionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        success: false,
        error: 'Session not found'
      };
    }

    return {
      success: true,
      session: {
        id: docSnap.id,
        ...docSnap.data()
      }
    };
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
    const q = query(
      collection(db, 'rejuvenation_sessions'),
      where('participants.partnerA.userId', '==', userId),
      orderBy('lastActive', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Also check for partnerB sessions (separate query due to Firestore limitations)
    const q2 = query(
      collection(db, 'rejuvenation_sessions'),
      where('participants.partnerB.userId', '==', userId),
      orderBy('lastActive', 'desc'),
      limit(50)
    );

    const querySnapshot2 = await getDocs(q2);
    const partnerBSessions = querySnapshot2.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Merge and dedupe
    const allSessions = [...sessions, ...partnerBSessions];
    const uniqueSessions = allSessions.filter((session, index, self) =>
      index === self.findIndex(s => s.id === session.id)
    );

    // Sort by lastActive
    uniqueSessions.sort((a, b) => {
      const dateA = a.lastActive?.toDate?.() || new Date(0);
      const dateB = b.lastActive?.toDate?.() || new Date(0);
      return dateB - dateA;
    });

    return {
      success: true,
      sessions: uniqueSessions
    };
  } catch (error) {
    console.error('Error getting user sessions:', error);
    return {
      success: false,
      error: error.message,
      sessions: []
    };
  }
}

/**
 * Update session status
 */
export async function updateSessionStatus(sessionId, status) {
  try {
    const docRef = doc(db, 'rejuvenation_sessions', sessionId);
    await updateDoc(docRef, {
      status,
      lastActive: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating session status:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ASSESSMENT & PROGRESS TRACKING
// ============================================================================

/**
 * Save initial assessment for a session
 */
export async function saveInitialAssessment(sessionId, assessment) {
  try {
    const docRef = doc(db, 'rejuvenation_sessions', sessionId);

    const assessmentData = {
      loveLevel: assessment.loveLevel,
      compassionLevel: assessment.compassionLevel,
      connectionLevel: assessment.connectionLevel,
      notes: assessment.notes || '',
      recordedAt: serverTimestamp()
    };

    await updateDoc(docRef, {
      'progressTracking.initialAssessment': assessmentData,
      'progressTracking.currentAssessment': assessmentData,
      lastActive: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving initial assessment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Record a progress update
 */
export async function recordProgressUpdate(sessionId, assessment) {
  try {
    const docRef = doc(db, 'rejuvenation_sessions', sessionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: 'Session not found' };
    }

    const currentData = docSnap.data();
    const assessmentData = {
      loveLevel: assessment.loveLevel,
      compassionLevel: assessment.compassionLevel,
      connectionLevel: assessment.connectionLevel,
      notes: assessment.notes || '',
      recordedAt: serverTimestamp()
    };

    // Add to history
    const history = currentData.progressTracking?.assessmentHistory || [];
    history.push(currentData.progressTracking?.currentAssessment || assessmentData);

    await updateDoc(docRef, {
      'progressTracking.currentAssessment': assessmentData,
      'progressTracking.assessmentHistory': history,
      lastActive: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error recording progress update:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// ANGEL MANAGEMENT
// ============================================================================

/**
 * Invite an angel couple to the session
 */
export async function inviteAngelCouple(sessionId, coupleId) {
  try {
    const docRef = doc(db, 'rejuvenation_sessions', sessionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: 'Session not found' };
    }

    const currentData = docSnap.data();
    const consultedAngels = currentData.consultedAngels || [];

    // Check if already invited
    if (consultedAngels.some(a => a.coupleId === coupleId)) {
      return { success: false, error: 'Angel couple already invited' };
    }

    consultedAngels.push({
      coupleId,
      invitedAt: now(),
      conversationCount: 0
    });

    await updateDoc(docRef, {
      consultedAngels,
      lastActive: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error inviting angel couple:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

/**
 * Send a message in the session
 */
export async function sendMessage(sessionId, message) {
  try {
    const messageData = {
      sessionId,
      sender: {
        type: message.senderType, // 'partnerA', 'partnerB', 'angelC', 'angelD'
        userId: message.userId || null,
        name: message.senderName,
        coupleId: message.coupleId || null
      },
      content: {
        text: message.text,
        type: message.type || 'text'
      },
      metadata: {
        replyTo: message.replyTo || null,
        emotion: message.emotion || null
      },
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(
      collection(db, 'rejuvenation_sessions', sessionId, 'messages'),
      messageData
    );

    // Update session lastActive and message count
    const sessionRef = doc(db, 'rejuvenation_sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);
    const currentCount = sessionSnap.data()?.messageCount || 0;

    await updateDoc(sessionRef, {
      lastActive: serverTimestamp(),
      messageCount: currentCount + 1
    });

    return {
      success: true,
      messageId: docRef.id
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Subscribe to real-time messages
 */
export function subscribeToMessages(sessionId, callback) {
  const q = query(
    collection(db, 'rejuvenation_sessions', sessionId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(100)
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  }, (error) => {
    console.error('Error subscribing to messages:', error);
    callback([]);
  });
}

/**
 * Get messages for a session (non-realtime)
 */
export async function getSessionMessages(sessionId, limitCount = 50) {
  try {
    const q = query(
      collection(db, 'rejuvenation_sessions', sessionId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      messages
    };
  } catch (error) {
    console.error('Error getting messages:', error);
    return { success: false, error: error.message, messages: [] };
  }
}
