/**
 * useAudioBuffer Hook
 *
 * Manages audio conversation buffer with:
 * - sessionStorage persistence
 * - Audio file upload to Storage
 * - Transcription handling
 * - Batch writes to Brain 5 + Brain 7 + Brain 1B
 *
 * Usage:
 * const { buffer, addAudioMessage, saveBatch } =
 *   useAudioBuffer(userId, partnerId);
 */

import { useState, useEffect, useCallback } from 'react';
import { db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, collection, writeBatch, arrayUnion } from 'firebase/firestore';
import { extractBiographicalFacts } from '../services/factExtraction';
import { transcribeAudio } from '../services/transcription';

export function useAudioBuffer(userId, partnerId) {
  const today = new Date().toISOString().split('T')[0];
  const sessionKey = `session_${userId}_${partnerId}_${today}_audio`;

  // Initialize from sessionStorage
  const [buffer, setBuffer] = useState(() => {
    try {
      const stored = sessionStorage.getItem(sessionKey);
      if (stored) {
        // Note: audio_blob cannot be serialized, so we only restore metadata
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          messages: parsed.messages.map(m => ({
            ...m,
            audio_blob: null // Blobs can't be restored
          }))
        };
      }
    } catch (error) {
      console.error('Failed to load audio buffer:', error);
    }

    return {
      session_id: `sess_audio_${Date.now()}`,
      user_id: userId,
      partner_id: partnerId,
      modality: 'audio',
      started_at: new Date().toISOString(),
      messages: [],
      pending_saves: 0,
      last_save: null
    };
  });

  // Save metadata to sessionStorage (excluding blobs)
  useEffect(() => {
    try {
      const serializableBuffer = {
        ...buffer,
        messages: buffer.messages.map(({ audio_blob, ...rest }) => rest)
      };
      sessionStorage.setItem(sessionKey, JSON.stringify(serializableBuffer));
    } catch (error) {
      console.error('Failed to save audio buffer:', error);
    }
  }, [buffer, sessionKey]);

  // Add audio message to buffer
  const addAudioMessage = useCallback((audioBlob, metadata) => {
    setBuffer(prev => ({
      ...prev,
      messages: [...prev.messages, {
        temp_id: `temp_audio_${Date.now()}`,
        timestamp: new Date().toISOString(),
        sender: metadata.sender,
        audio_blob: audioBlob,
        duration_seconds: metadata.duration_seconds,
        transcription: metadata.transcription || null,
        transcription_confidence: metadata.transcription_confidence || null,
        partner_name: metadata.partner_name,
        user_display_name: metadata.user_display_name,
        saved_to_firebase: false,
        uploaded_to_storage: false
      }],
      pending_saves: prev.pending_saves + 1
    }));
  }, []);

  // Upload audio file to Storage
  async function uploadAudioFile(audioBlob, messageId, userId, partnerId) {
    const storagePath = `audio/${userId}/${partnerId}/${messageId}.webm`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, audioBlob);
    const downloadURL = await getDownloadURL(storageRef);

    return {
      storage_path: storagePath,
      download_url: downloadURL
    };
  }

  // Batch save audio messages
  const saveBatch = useCallback(async () => {
    const unsaved = buffer.messages.filter(m => !m.saved_to_firebase && m.audio_blob);

    if (unsaved.length === 0) {
      return { success: true, saved: 0 };
    }

    console.log(`Saving batch of ${unsaved.length} audio messages...`);

    try {
      const batch = writeBatch(db);
      const threadId = `thread_${userId}_${partnerId}_${today}`;

      for (const message of unsaved) {
        // 1. Upload audio file to Storage
        let audioUrl, storagePath;
        try {
          const brain5Ref = doc(collection(db, 'brain5_active_audio'));

          const uploadResult = await uploadAudioFile(
            message.audio_blob,
            brain5Ref.id,
            userId,
            partnerId
          );
          audioUrl = uploadResult.download_url;
          storagePath = uploadResult.storage_path;

          // 2. Transcribe if not already transcribed
          let transcription = message.transcription;
          let transcriptionConfidence = message.transcription_confidence;

          if (!transcription && audioUrl) {
            try {
              const transcribeResult = await transcribeAudio(audioUrl);
              transcription = transcribeResult.text;
              transcriptionConfidence = transcribeResult.confidence;
            } catch (error) {
              console.error('Transcription failed:', error);
            }
          }

          // 3. Write to Brain 5 (audio)
          batch.set(brain5Ref, {
            message_id: brain5Ref.id,
            timestamp: message.timestamp,

            chatting_as: {
              profile_id: userId,
              display_name: message.user_display_name || 'User'
            },

            chatting_with: {
              partner_id: partnerId,
              partner_name: message.partner_name,
              partner_type: 'historical_figure',
              partner_source: 'curated'
            },

            modality: {
              type: 'audio',
              mode: 'voice_call',
              platform: 'web'
            },

            sender: message.sender,
            sender_role: message.sender === userId ? 'user' : 'guest',

            content: {
              audio_url: audioUrl,
              storage_path: storagePath,
              duration_seconds: message.duration_seconds,
              transcription: transcription || '',
              transcription_confidence: transcriptionConfidence || 0,
              language: 'en-US'
            },

            thread_id: threadId,

            luna: {
              mode: 'silent',
              participated: false,
              monitoring: true
            },

            access: {
              visible_to: [userId, partnerId, 'soulpartner_primary']
            },

            created_at: message.timestamp
          });

          // 4. Write to Brain 7 (unified witness)
          const brain7Ref = doc(collection(db, 'brain7_unified_witness'));
          batch.set(brain7Ref, {
            entry_id: brain7Ref.id,
            timestamp: message.timestamp,
            profile_id: userId,

            event_type: 'conversation_message',
            modality: 'audio',
            summary: transcription ? transcription.substring(0, 200) : 'Audio message',

            source_message_id: brain5Ref.id,
            source_collection: 'brain5_active_audio',
            source_thread_id: threadId,
            source_partner_id: partnerId,

            access: {
              read_access: ['soulpartner_primary', userId]
            },

            created_at: message.timestamp
          });

          // 5. Extract facts from transcription -> Brain 1B
          if (message.sender === userId && transcription) {
            try {
              const facts = await extractBiographicalFacts(transcription, {
                userId,
                partnerId,
                messageId: brain5Ref.id,
                timestamp: message.timestamp
              });

              if (facts.length > 0) {
                const brain1BRef = doc(db, `users/${userId}/brain1_learned_biography/${partnerId}`);
                batch.set(brain1BRef, {
                  partner_id: partnerId,
                  learned_facts: arrayUnion(...facts),
                  last_updated: message.timestamp
                }, { merge: true });
              }
            } catch (error) {
              console.error('Fact extraction from audio failed:', error);
            }
          }

        } catch (error) {
          console.error('Failed to process audio message:', error);
          // Continue with other messages
        }
      }

      // Commit batch
      await batch.commit();

      // Mark as saved
      setBuffer(prev => ({
        ...prev,
        messages: prev.messages.map(m => ({
          ...m,
          saved_to_firebase: true,
          uploaded_to_storage: true,
          audio_blob: null // Clear blob after upload
        })),
        pending_saves: 0,
        last_save: new Date().toISOString()
      }));

      console.log(`Saved ${unsaved.length} audio messages`);

      return { success: true, saved: unsaved.length };

    } catch (error) {
      console.error('Failed to save audio batch:', error);
      return { success: false, error: error.message };
    }
  }, [buffer, userId, partnerId, today]);

  // Auto-save triggers (same as text)
  useEffect(() => {
    if (buffer.pending_saves === 0) return;
    const timer = setTimeout(saveBatch, 30000);
    return () => clearTimeout(timer);
  }, [buffer.pending_saves, saveBatch]);

  useEffect(() => {
    if (buffer.pending_saves >= 5) {
      saveBatch();
    }
  }, [buffer.pending_saves, saveBatch]);

  // Clear buffer
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
    addAudioMessage,
    saveBatch,
    clearBuffer,
    pendingSaves: buffer.pending_saves
  };
}

export default useAudioBuffer;
