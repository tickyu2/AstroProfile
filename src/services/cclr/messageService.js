/**
 * CCLR Message Service
 *
 * Handles conversation messages between couples and angels.
 * Includes vector embeddings for semantic search.
 * Follows GENESIS Brain 2/8 pattern for embeddings.
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
  limit,
  Timestamp,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { createMessageDocument } from './schema/firestoreSchema';
import { updateAngelStats } from './sessionService';
import { getAngelCouple } from '../../data/cclr/cosmicLoveAngels';

const CONVERSATIONS_COLLECTION = 'cclr_conversations';

/**
 * Save a new message to the conversation
 */
export async function saveMessage({
  sessionId,
  text,
  speaker,
  speakerName,
  speakerIcon,
  bubbleColor,
  isHuman,
  isAI,
  guestCoupleId = null,
  guestPersonId = null,
  sessionMode = 'together',
  userId = null,
  partnerAUserId,
  partnerBUserId
}) {
  try {
    // Create message document
    const messageData = createMessageDocument({
      sessionId,
      text,
      speaker,
      speakerName,
      speakerIcon,
      bubbleColor,
      isHuman,
      isAI,
      guestCoupleId,
      guestPersonId,
      sessionMode,
      userId,
      visibleTo: [partnerAUserId, partnerBUserId].filter(Boolean)
    });

    // Get couple name if AI message
    if (isAI && guestCoupleId) {
      const angelCouple = getAngelCouple(guestCoupleId);
      if (angelCouple) {
        messageData.coupleName = angelCouple.coupleName;
      }
    }

    // Save to Firestore (embedding will be generated via Cloud Function)
    const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), messageData);

    // Generate embedding via Cloud Function
    try {
      const generateCCLREmbedding = httpsCallable(functions, 'generateCCLREmbedding');
      await generateCCLREmbedding({
        messageId: docRef.id,
        text: text
      });
    } catch (embeddingError) {
      console.warn('Embedding generation failed, message saved without embedding:', embeddingError);
    }

    // Update angel stats if this is an AI message
    if (isAI && guestCoupleId && guestPersonId) {
      await updateAngelStats(sessionId, guestCoupleId, guestPersonId, []);
    }

    return {
      success: true,
      messageId: docRef.id,
      message: { ...messageData, id: docRef.id }
    };
  } catch (error) {
    console.error('Error saving message:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all messages for a session
 */
export async function getSessionMessages(sessionId, limitCount = 100) {
  try {
    const messagesRef = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(
      messagesRef,
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const messages = [];

    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      messages
    };
  } catch (error) {
    console.error('Error getting session messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Subscribe to real-time messages for a session
 */
export function subscribeToSessionMessages(sessionId, callback) {
  const messagesRef = collection(db, CONVERSATIONS_COLLECTION);
  const q = query(
    messagesRef,
    where('sessionId', '==', sessionId),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  }, (error) => {
    console.error('Error subscribing to messages:', error);
    callback([], error);
  });
}

/**
 * Get messages by a specific angel
 */
export async function getAngelMessages(sessionId, guestPersonId) {
  try {
    const messagesRef = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(
      messagesRef,
      where('sessionId', '==', sessionId),
      where('guestPersonId', '==', guestPersonId),
      orderBy('timestamp', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const messages = [];

    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      messages
    };
  } catch (error) {
    console.error('Error getting angel messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get messages by a specific partner
 */
export async function getPartnerMessages(sessionId, speaker) {
  try {
    const messagesRef = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(
      messagesRef,
      where('sessionId', '==', sessionId),
      where('speaker', '==', speaker),
      orderBy('timestamp', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const messages = [];

    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      messages
    };
  } catch (error) {
    console.error('Error getting partner messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Mark a message as helpful
 */
export async function markMessageHelpful(messageId) {
  try {
    const docRef = doc(db, CONVERSATIONS_COLLECTION, messageId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, error: 'Message not found' };
    }

    const currentCount = docSnap.data().helpfulCount || 0;

    await updateDoc(docRef, {
      markedHelpful: true,
      helpfulCount: currentCount + 1,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error marking message helpful:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Save message for later reference
 */
export async function saveMessageForLater(messageId) {
  try {
    const docRef = doc(db, CONVERSATIONS_COLLECTION, messageId);
    await updateDoc(docRef, {
      savedForLater: true,
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving message for later:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get saved messages for a session
 */
export async function getSavedMessages(sessionId) {
  try {
    const messagesRef = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(
      messagesRef,
      where('sessionId', '==', sessionId),
      where('savedForLater', '==', true),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const messages = [];

    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      messages
    };
  } catch (error) {
    console.error('Error getting saved messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get helpful messages (angel wisdom that resonated)
 */
export async function getHelpfulMessages(sessionId) {
  try {
    const messagesRef = collection(db, CONVERSATIONS_COLLECTION);
    const q = query(
      messagesRef,
      where('sessionId', '==', sessionId),
      where('markedHelpful', '==', true),
      orderBy('helpfulCount', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const messages = [];

    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      messages
    };
  } catch (error) {
    console.error('Error getting helpful messages:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get conversation context for AI (recent messages)
 */
export async function getConversationContext(sessionId, messageLimit = 20) {
  try {
    const { messages } = await getSessionMessages(sessionId, messageLimit);

    // Format for AI context
    const context = messages.map(msg => ({
      role: msg.isHuman ? 'user' : 'assistant',
      speaker: msg.speakerName,
      content: msg.text,
      isAngel: msg.isAI,
      angelName: msg.isAI ? msg.speakerName : null
    }));

    return {
      success: true,
      context
    };
  } catch (error) {
    console.error('Error getting conversation context:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Add private note (only visible to one partner + AI)
 */
export async function addPrivateNote(messageId, {
  userId,
  sessionId,
  text,
  forAI = true
}) {
  try {
    const privateNotesRef = collection(db, CONVERSATIONS_COLLECTION, messageId, 'private_notes');

    const noteData = {
      noteId: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionId,
      messageId,
      text,
      forAI,
      aiResponse: null,
      visibility: forAI ? 'private_to_AI' : 'private_to_user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(privateNotesRef, noteData);

    return {
      success: true,
      noteId: docRef.id,
      note: noteData
    };
  } catch (error) {
    console.error('Error adding private note:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get private notes for a user
 */
export async function getPrivateNotes(messageId, userId) {
  try {
    const privateNotesRef = collection(db, CONVERSATIONS_COLLECTION, messageId, 'private_notes');
    const q = query(
      privateNotesRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const notes = [];

    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      notes
    };
  } catch (error) {
    console.error('Error getting private notes:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  saveMessage,
  getSessionMessages,
  subscribeToSessionMessages,
  getAngelMessages,
  getPartnerMessages,
  markMessageHelpful,
  saveMessageForLater,
  getSavedMessages,
  getHelpfulMessages,
  getConversationContext,
  addPrivateNote,
  getPrivateNotes
};
