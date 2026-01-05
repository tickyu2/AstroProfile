/**
 * useSessionBuffer Hook
 *
 * Manages text conversation buffer with:
 * - sessionStorage persistence
 * - Auto-save triggers (30 sec OR 5 messages)
 * - Batch writes to Firebase
 * - Brain 1B fact extraction
 *
 * Usage:
 * const { buffer, addMessage, saveBatch, pendingSaves } =
 *   useSessionBuffer(userId, partnerId, 'text');
 */

import { useState, useEffect, useCallback } from 'react';
import { db } from '../config/firebase';
import { arrayUnion, doc, collection, writeBatch, setDoc } from 'firebase/firestore';
import { extractBiographicalFacts } from '../services/factExtraction';

export function useSessionBuffer(userId, partnerId, modality = 'text') {
  const today = new Date().toISOString().split('T')[0];
  const sessionKey = `session_${userId}_${partnerId}_${today}_${modality}`;

  // Initialize from sessionStorage or create new
  const [buffer, setBuffer] = useState(() => {
    try {
      const stored = sessionStorage.getItem(sessionKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load buffer from sessionStorage:', error);
    }

    return {
      session_id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      partner_id: partnerId,
      modality,
      started_at: new Date().toISOString(),
      status: 'active',
      messages: [],
      pending_saves: 0,
      last_save: null
    };
  });

  // Save to sessionStorage on every buffer change
  useEffect(() => {
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify(buffer));
    } catch (error) {
      console.error('Failed to save buffer to sessionStorage:', error);
    }
  }, [buffer, sessionKey]);

  // Add message to buffer
  const addMessage = useCallback((message) => {
    setBuffer(prev => ({
      ...prev,
      messages: [...prev.messages, {
        ...message,
        temp_id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: message.timestamp || new Date().toISOString(),
        saved_to_firebase: false
      }],
      pending_saves: prev.pending_saves + 1
    }));
  }, []);

  // Batch save to Firebase
  const saveBatch = useCallback(async () => {
    const unsaved = buffer.messages.filter(m => !m.saved_to_firebase);

    if (unsaved.length === 0) {
      console.log('No unsaved messages to batch');
      return { success: true, saved: 0 };
    }

    console.log(`Saving batch of ${unsaved.length} messages...`);

    try {
      const batch = writeBatch(db);
      const threadId = `thread_${userId}_${partnerId}_${today}`;

      for (const message of unsaved) {
        // 1. Write to Brain 3 (text) - Main collection
        const brain3Ref = doc(collection(db, 'brain3_active_text'));
        batch.set(brain3Ref, {
          message_id: brain3Ref.id,
          timestamp: message.timestamp,

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
            type: 'text',
            mode: 'chat',
            platform: 'web'
          },

          sender: message.sender,
          sender_role: message.sender === userId ? 'user' : 'guest',

          content: {
            text: message.content?.text || message.content
          },

          thread_id: threadId,
          thread_position: buffer.messages.indexOf(message) + 1,

          luna: {
            mode: message.luna_mode || 'silent',
            participated: false,
            monitoring: true
          },

          analysis: {
            emotional_tone: message.emotional_tone || 'neutral',
            topics: message.topics || [],
            harm_score: 0.0
          },

          access: {
            visible_to: [userId, partnerId, 'soulpartner_primary']
          },

          created_at: message.timestamp
        });

        // 2. Write to Brain 7 (unified witness - Luna only)
        const brain7Ref = doc(collection(db, 'brain7_unified_witness'));
        batch.set(brain7Ref, {
          entry_id: brain7Ref.id,
          timestamp: message.timestamp,
          profile_id: userId,

          event_type: 'conversation_message',
          modality: 'text',
          summary: (message.content?.text || message.content || '').substring(0, 200),

          source_message_id: brain3Ref.id,
          source_collection: 'brain3_active_text',
          source_thread_id: threadId,
          source_partner_id: partnerId,

          emotional_tone: message.emotional_tone || 'neutral',
          topics: message.topics || [],
          constitutional_observation: message.constitutional_observation || null,

          access: {
            read_access: ['soulpartner_primary', userId]
          },

          created_at: message.timestamp
        });

        // 3. Extract biographical facts -> Brain 1B (if user message)
        if (message.sender === userId && (message.content?.text || message.content)) {
          try {
            const textContent = message.content?.text || message.content;
            const facts = await extractBiographicalFacts(textContent, {
              userId,
              partnerId,
              messageId: brain3Ref.id,
              timestamp: message.timestamp
            });

            if (facts.length > 0) {
              const brain1BRef = doc(db, `users/${userId}/brain1_learned_biography/${partnerId}`);

              // Use merge to add facts without overwriting
              batch.set(brain1BRef, {
                partner_id: partnerId,
                partner_name: message.partner_name,
                partner_type: message.partner_type || 'historical_figure',
                learned_facts: arrayUnion(...facts),
                last_updated: message.timestamp
              }, { merge: true });

              console.log(`Extracted ${facts.length} facts for Brain 1B`);
            }
          } catch (error) {
            console.error('Fact extraction failed:', error);
            // Don't fail the whole batch if fact extraction fails
          }
        }
      }

      // Commit batch
      await batch.commit();

      // Mark messages as saved
      setBuffer(prev => ({
        ...prev,
        messages: prev.messages.map(m => ({
          ...m,
          saved_to_firebase: true
        })),
        pending_saves: 0,
        last_save: new Date().toISOString()
      }));

      console.log(`Saved ${unsaved.length} messages to Firebase`);

      return { success: true, saved: unsaved.length };

    } catch (error) {
      console.error('Failed to save batch:', error);
      // Keep messages in buffer for retry
      return { success: false, error: error.message };
    }
  }, [buffer, userId, partnerId, today]);

  // AUTO-SAVE TRIGGER 1: Every 30 seconds if pending
  useEffect(() => {
    if (buffer.pending_saves === 0) return;

    const timer = setTimeout(() => {
      console.log('Auto-save trigger: 30 seconds elapsed');
      saveBatch();
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [buffer.pending_saves, saveBatch]);

  // AUTO-SAVE TRIGGER 2: Every 5 messages
  useEffect(() => {
    if (buffer.pending_saves >= 5) {
      console.log('Auto-save trigger: 5 messages accumulated');
      saveBatch();
    }
  }, [buffer.pending_saves, saveBatch]);

  // AUTO-SAVE TRIGGER 3: On window unload (user leaving page)
  useEffect(() => {
    const handleUnload = (e) => {
      if (buffer.pending_saves > 0) {
        // Try synchronous save (limited but better than nothing)
        const data = JSON.stringify({
          userId,
          partnerId,
          messages: buffer.messages.filter(m => !m.saved_to_firebase)
        });

        // navigator.sendBeacon for reliable unload save
        navigator.sendBeacon('/api/save-session', data);

        // Show warning if unsaved
        e.preventDefault();
        e.returnValue = 'You have unsaved messages. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [buffer, userId, partnerId]);

  // Manual clear buffer (after successful save or session end)
  const clearBuffer = useCallback(() => {
    sessionStorage.removeItem(sessionKey);
    setBuffer(prev => ({
      ...prev,
      messages: [],
      pending_saves: 0,
      status: 'completed'
    }));
  }, [sessionKey]);

  return {
    buffer,
    addMessage,
    saveBatch,
    clearBuffer,
    pendingSaves: buffer.pending_saves,
    lastSave: buffer.last_save
  };
}

export default useSessionBuffer;
