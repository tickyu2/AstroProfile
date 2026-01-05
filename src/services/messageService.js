/**
 * MESSAGE SERVICE
 *
 * Unified service for saving messages to:
 * - Brain 3 (text) or Brain 5 (audio)
 * - Brain 7 (unified witness)
 * - Brain 1B (extracted facts)
 *
 * Used by JSON buffer hooks for batch writes.
 */

import { db } from '../config/firebase';
import {
  doc,
  collection,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

export class MessageService {
  /**
   * Save single message (used for real-time critical messages)
   */
  static async saveMessage(userId, partnerId, message, modality = 'text') {
    const today = new Date().toISOString().split('T')[0];
    const threadId = `thread_${userId}_${partnerId}_${today}`;

    const collectionName = modality === 'audio' ? 'brain5_active_audio' : 'brain3_active_text';
    const messageRef = doc(collection(db, collectionName));

    const messageData = {
      message_id: messageRef.id,
      timestamp: message.timestamp || new Date().toISOString(),

      chatting_as: {
        profile_id: userId,
        display_name: message.user_display_name || 'User'
      },

      chatting_with: {
        partner_id: partnerId,
        partner_name: message.partner_name,
        partner_type: message.partner_type || 'historical_figure',
        partner_source: 'curated'
      },

      modality: {
        type: modality,
        mode: modality === 'audio' ? 'voice_call' : 'chat',
        platform: 'web'
      },

      sender: message.sender,
      sender_role: message.sender === userId ? 'user' : 'guest',

      content: message.content,

      thread_id: threadId,

      luna: {
        mode: message.luna_mode || 'silent',
        participated: false,
        monitoring: true
      },

      access: {
        visible_to: [userId, partnerId, 'soulpartner_primary']
      },

      created_at: message.timestamp || new Date().toISOString()
    };

    await setDoc(messageRef, messageData);

    // Also save to Brain 7 (witness)
    await this.saveToWitness(userId, partnerId, messageRef.id, collectionName, message, modality);

    return messageRef.id;
  }

  /**
   * Save to Brain 7 (unified witness - Luna only)
   */
  static async saveToWitness(userId, partnerId, sourceMessageId, sourceCollection, message, modality) {
    const witnessRef = doc(collection(db, 'brain7_unified_witness'));

    const summary = modality === 'text'
      ? (message.content?.text || message.content || '').substring(0, 200)
      : (message.content?.transcription || '').substring(0, 200) || 'Audio message';

    await setDoc(witnessRef, {
      entry_id: witnessRef.id,
      timestamp: message.timestamp || new Date().toISOString(),
      profile_id: userId,

      event_type: 'conversation_message',
      modality,
      summary,

      source_message_id: sourceMessageId,
      source_collection: sourceCollection,
      source_partner_id: partnerId,

      emotional_tone: message.emotional_tone || 'neutral',
      topics: message.topics || [],

      access: {
        read_access: ['soulpartner_primary', userId]
      },

      created_at: message.timestamp || new Date().toISOString()
    });
  }

  /**
   * Load conversation history (text + audio unified)
   */
  static async loadUnifiedThread(userId, partnerId, messageLimit = 20) {
    const today = new Date().toISOString().split('T')[0];
    const threadId = `thread_${userId}_${partnerId}_${today}`;

    // Load text messages
    const textQuery = query(
      collection(db, 'brain3_active_text'),
      where('thread_id', '==', threadId),
      orderBy('timestamp', 'asc'),
      limit(messageLimit)
    );

    const textSnapshot = await getDocs(textQuery);
    const textMessages = textSnapshot.docs.map(doc => ({
      ...doc.data(),
      source: 'text'
    }));

    // Load audio messages
    const audioQuery = query(
      collection(db, 'brain5_active_audio'),
      where('thread_id', '==', threadId),
      orderBy('timestamp', 'asc'),
      limit(messageLimit)
    );

    const audioSnapshot = await getDocs(audioQuery);
    const audioMessages = audioSnapshot.docs.map(doc => ({
      ...doc.data(),
      source: 'audio'
    }));

    // Merge and sort by timestamp
    const unified = [...textMessages, ...audioMessages]
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return unified;
  }

  /**
   * Load messages for a specific partner across all days
   */
  static async loadPartnerHistory(userId, partnerId, messageLimit = 50) {
    // Load text messages for this partner
    const textQuery = query(
      collection(db, 'brain3_active_text'),
      where('chatting_as.profile_id', '==', userId),
      where('chatting_with.partner_id', '==', partnerId),
      orderBy('timestamp', 'desc'),
      limit(messageLimit)
    );

    const textSnapshot = await getDocs(textQuery);
    const textMessages = textSnapshot.docs.map(doc => ({
      ...doc.data(),
      source: 'text'
    }));

    // Reverse to get chronological order
    return textMessages.reverse();
  }

  /**
   * Get Brain 7 witness entries for Luna
   */
  static async getWitnessEntries(userId, entryLimit = 100) {
    const witnessQuery = query(
      collection(db, 'brain7_unified_witness'),
      where('profile_id', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(entryLimit)
    );

    const snapshot = await getDocs(witnessQuery);
    return snapshot.docs.map(doc => doc.data());
  }
}

export default MessageService;
