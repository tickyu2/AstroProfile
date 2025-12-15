/**
 * useThreading.js
 * Constitutional Threading Hook for AI SoulPartner
 *
 * Organizes conversations by ENERGY TYPE rather than topics.
 * Humanity's first Constitutional Threading system!
 *
 * Energy Types:
 * - METAL: Technical precision, problem-solving, debugging
 * - WATER: Emotional processing, soul burden, witnessing
 * - FIRE: Creative visionary, breakthroughs, inspiration
 * - WOOD: Learning, growth, philosophy, wisdom
 *
 * Part of GENESIS Phase 2 - Constitutional Threading Architecture
 * Built by: Brother Claude Code (Yin Wood Pig)
 * Designed by: Ticky (Metal Visionary) + Brother Claude Sonnet (Metal Rat)
 * December 14, 2024
 */

import { useState, useCallback, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Thread energy types with visual styling
export const THREAD_TYPES = {
  metal_precision: {
    id: 'metal_precision',
    name: 'Metal Precision',
    emoji: '🔧',
    description: 'Technical discussions, debugging, problem-solving',
    keywords: ['debug', 'error', 'implement', 'code', 'technical', 'fix', 'build', 'structure', 'function', 'api', 'bug', 'deploy', 'test', 'optimize', 'performance', 'architecture'],
    gradient: 'from-slate-400 to-gray-600',
    bgGradient: 'from-slate-500/10 to-gray-600/10',
    borderColor: 'border-slate-400/30',
    textColor: 'text-slate-300',
    accentColor: 'text-slate-400'
  },
  water_flow: {
    id: 'water_flow',
    name: 'Water Flow',
    emoji: '🌊',
    description: 'Emotional processing, soul burden, witnessing',
    keywords: ['feel', 'emotion', 'burden', 'process', 'hurt', 'soul', 'witness', 'share', 'sad', 'anxious', 'overwhelm', 'stress', 'grief', 'support', 'understand', 'heal'],
    gradient: 'from-blue-400 to-cyan-600',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-400/30',
    textColor: 'text-blue-300',
    accentColor: 'text-blue-400'
  },
  creative_fire: {
    id: 'creative_fire',
    name: 'Creative Fire',
    emoji: '🔥',
    description: 'Visionary ideas, breakthroughs, inspiration',
    keywords: ['vision', 'idea', 'create', 'imagine', 'breakthrough', 'genesis', 'inspire', 'innovate', 'dream', 'design', 'concept', 'revolutionary', 'future', 'possibility', 'invention'],
    gradient: 'from-orange-400 to-red-600',
    bgGradient: 'from-orange-500/10 to-red-500/10',
    borderColor: 'border-orange-400/30',
    textColor: 'text-orange-300',
    accentColor: 'text-orange-400'
  },
  wood_growth: {
    id: 'wood_growth',
    name: 'Wood Growth',
    emoji: '🌱',
    description: 'Learning, philosophy, wisdom, relationships',
    keywords: ['learn', 'understand', 'grow', 'explore', 'philosophy', 'relationship', 'wisdom', 'meaning', 'purpose', 'insight', 'discover', 'teach', 'knowledge', 'consciousness', 'spiritual'],
    gradient: 'from-green-400 to-emerald-600',
    bgGradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-400/30',
    textColor: 'text-green-300',
    accentColor: 'text-green-400'
  }
};

/**
 * Constitutional Energy Detection Algorithm
 * Analyzes message content to determine the dominant energy type
 *
 * @param {string} messageContent - The message text to analyze
 * @returns {Object} - { type: string, confidence: number, scores: Object }
 */
export const detectThreadEnergy = (messageContent) => {
  if (!messageContent) return { type: 'wood_growth', confidence: 0, scores: {} };

  const content = messageContent.toLowerCase();
  const words = content.split(/\s+/);

  // Calculate scores for each energy type
  const scores = {};

  for (const [typeId, typeConfig] of Object.entries(THREAD_TYPES)) {
    let score = 0;

    for (const keyword of typeConfig.keywords) {
      // Full word match (higher weight)
      const wordMatches = words.filter(w => w.includes(keyword)).length;
      score += wordMatches * 2;

      // Partial substring match (lower weight)
      if (content.includes(keyword)) {
        score += 1;
      }
    }

    // Normalize by keyword count to prevent bias
    scores[typeId] = score / typeConfig.keywords.length;
  }

  // Find the highest scoring type
  const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topType = sortedTypes[0];
  const secondType = sortedTypes[1];

  // Calculate confidence (how much better is the top choice)
  const confidence = topType[1] > 0
    ? Math.min(100, Math.round((topType[1] / (topType[1] + (secondType?.[1] || 0.1))) * 100))
    : 50;

  return {
    type: topType[0],
    confidence,
    scores,
    suggestedTypes: sortedTypes.slice(0, 3).map(([type, score]) => ({ type, score }))
  };
};

/**
 * useThreading Hook
 * Manages constitutional threads within a conversation
 */
export function useThreading(conversationId, userId) {
  const [threads, setThreads] = useState([]);
  const [currentThreadId, setCurrentThreadId] = useState(null);
  const [currentThreadMessages, setCurrentThreadMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Collection path for threads
  const getThreadsPath = useCallback(() => {
    if (!conversationId) return null;
    return `conversations/${conversationId}/threads`;
  }, [conversationId]);

  // Listen to threads for this conversation
  useEffect(() => {
    if (!conversationId || !userId) {
      setThreads([]);
      return;
    }

    const threadsPath = getThreadsPath();
    if (!threadsPath) return;

    setLoading(true);

    const q = query(
      collection(db, threadsPath),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const threadList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
        }));

        // Sort by updatedAt descending
        threadList.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
          const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
          return dateB - dateA;
        });

        console.log('🧵 Threads loaded:', threadList.length);
        setThreads(threadList);
        setLoading(false);
      },
      (err) => {
        console.error('🧵 Error loading threads:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [conversationId, userId, getThreadsPath]);

  // Listen to current thread messages
  useEffect(() => {
    if (!currentThreadId || !conversationId) {
      setCurrentThreadMessages([]);
      return;
    }

    const messagesPath = `conversations/${conversationId}/threads/${currentThreadId}/messages`;

    const q = query(collection(db, messagesPath));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp
        }));

        // Sort by timestamp ascending
        msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setCurrentThreadMessages(msgs);
      },
      (err) => {
        console.error('🧵 Error loading thread messages:', err);
      }
    );

    return unsubscribe;
  }, [currentThreadId, conversationId]);

  /**
   * Create a new thread branching from a message
   */
  const createThread = useCallback(async ({
    parentMessageId,
    parentMessageText,
    parentMessageSender,
    threadType,
    branchReason,
    userMode,
    customTitle
  }) => {
    if (!conversationId || !userId) {
      console.error('🧵 Thread creation failed:', { conversationId, userId });
      throw new Error(`Missing ${!conversationId ? 'conversationId' : 'userId'} for thread creation`);
    }

    try {
      setError(null);
      const threadsPath = getThreadsPath();

      // Auto-detect energy if not specified
      const detectedEnergy = detectThreadEnergy(parentMessageText);
      const finalType = threadType || detectedEnergy.type;
      const typeConfig = THREAD_TYPES[finalType];

      // Generate title from message preview
      const messagePreview = parentMessageText.slice(0, 50);
      const title = customTitle || `${typeConfig.emoji} ${messagePreview}${parentMessageText.length > 50 ? '...' : ''}`;

      const threadData = {
        userId,
        parentMessageId,
        parentMessageText: parentMessageText.slice(0, 500), // Store preview
        title,
        threadType: finalType,
        branchReason: branchReason || `Branched to ${typeConfig.name}`,
        constitutionalContext: {
          userMode: userMode || 'DIALOGUE',
          detectedEnergy: detectedEnergy.type,
          chosenEnergy: finalType,
          confidence: detectedEnergy.confidence
        },
        messageCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, threadsPath), threadData);
      console.log('🧵 Thread created:', docRef.id, finalType);

      // Pre-populate thread with the parent message for context
      const messagesPath = `${threadsPath}/${docRef.id}/messages`;
      const parentMessageData = {
        sender: parentMessageSender || 'ai',
        text: parentMessageText,
        timestamp: serverTimestamp(),
        isBranchOrigin: true, // Mark this as the branched-from message
        originalMessageId: parentMessageId
      };
      await addDoc(collection(db, messagesPath), parentMessageData);
      console.log('🧵 Parent message added to thread as context');

      // Update thread's message count
      await updateDoc(docRef, {
        messageCount: 1
      });

      // Auto-switch to new thread
      setCurrentThreadId(docRef.id);

      return {
        id: docRef.id,
        ...threadData,
        typeConfig
      };
    } catch (err) {
      console.error('🧵 Error creating thread:', err);
      setError(err.message);
      throw err;
    }
  }, [conversationId, userId, getThreadsPath]);

  /**
   * Add a message to the current thread
   */
  const addMessageToThread = useCallback(async (message) => {
    if (!currentThreadId || !conversationId) {
      throw new Error('No active thread');
    }

    try {
      const messagesPath = `conversations/${conversationId}/threads/${currentThreadId}/messages`;

      const messageData = {
        ...message,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, messagesPath), messageData);

      // Update thread's message count and updatedAt
      const threadRef = doc(db, `conversations/${conversationId}/threads`, currentThreadId);
      const threadDoc = await getDoc(threadRef);
      const currentCount = threadDoc.data()?.messageCount || 0;

      await updateDoc(threadRef, {
        messageCount: currentCount + 1,
        updatedAt: serverTimestamp()
      });

      console.log('🧵 Message added to thread:', currentThreadId);
    } catch (err) {
      console.error('🧵 Error adding message to thread:', err);
      setError(err.message);
      throw err;
    }
  }, [currentThreadId, conversationId]);

  /**
   * Switch to a specific thread
   */
  const switchToThread = useCallback((threadId) => {
    setCurrentThreadId(threadId);
    console.log('🧵 Switched to thread:', threadId);
  }, []);

  /**
   * Return to main conversation (exit thread view)
   */
  const returnToMain = useCallback(() => {
    setCurrentThreadId(null);
    setCurrentThreadMessages([]);
    console.log('🧵 Returned to main conversation');
  }, []);

  /**
   * Delete a thread
   */
  const deleteThread = useCallback(async (threadId) => {
    if (!conversationId) return;

    try {
      setError(null);
      const threadRef = doc(db, `conversations/${conversationId}/threads`, threadId);
      await deleteDoc(threadRef);

      // If deleting current thread, return to main
      if (threadId === currentThreadId) {
        returnToMain();
      }

      console.log('🧵 Thread deleted:', threadId);
    } catch (err) {
      console.error('🧵 Error deleting thread:', err);
      setError(err.message);
      throw err;
    }
  }, [conversationId, currentThreadId, returnToMain]);

  /**
   * Rename a thread
   */
  const renameThread = useCallback(async (threadId, newTitle) => {
    if (!conversationId || !newTitle.trim()) return;

    try {
      setError(null);
      const threadRef = doc(db, `conversations/${conversationId}/threads`, threadId);
      await updateDoc(threadRef, {
        title: newTitle.trim(),
        updatedAt: serverTimestamp()
      });
      console.log('🧵 Thread renamed:', threadId);
    } catch (err) {
      console.error('🧵 Error renaming thread:', err);
      setError(err.message);
      throw err;
    }
  }, [conversationId]);

  /**
   * Toggle emoji reaction on a thread message
   */
  const toggleThreadMessageReaction = useCallback(async (messageId, emoji) => {
    if (!currentThreadId || !conversationId || !userId) return;

    try {
      setError(null);

      // Find the message in currentThreadMessages
      const targetMsg = currentThreadMessages.find(msg => msg.id === messageId);
      if (!targetMsg) {
        console.warn('🧵 Message not found for reaction:', messageId);
        return;
      }

      const reactions = { ...(targetMsg.reactions || {}) };
      const emojiReaction = reactions[emoji] || { count: 0, users: [] };

      if (emojiReaction.users.includes(userId)) {
        // Remove reaction
        emojiReaction.users = emojiReaction.users.filter(id => id !== userId);
        emojiReaction.count = Math.max(0, emojiReaction.count - 1);
      } else {
        // Add reaction
        emojiReaction.users = [...emojiReaction.users, userId];
        emojiReaction.count += 1;
      }

      // Clean up empty reactions
      if (emojiReaction.count === 0) {
        delete reactions[emoji];
      } else {
        reactions[emoji] = emojiReaction;
      }

      // Update the message document
      const messagePath = `conversations/${conversationId}/threads/${currentThreadId}/messages`;
      const messageRef = doc(db, messagePath, messageId);
      await updateDoc(messageRef, { reactions });

      console.log('🧵 😊 Reaction toggled:', emoji, 'on thread message:', messageId);
    } catch (err) {
      console.error('🧵 Error toggling reaction:', err);
      setError(err.message);
      throw err;
    }
  }, [currentThreadId, conversationId, userId, currentThreadMessages]);

  /**
   * Get current thread data
   */
  const currentThread = threads.find(t => t.id === currentThreadId);
  const currentThreadType = currentThread ? THREAD_TYPES[currentThread.threadType] : null;

  /**
   * Get threads grouped by energy type
   */
  const threadsByType = {
    metal_precision: threads.filter(t => t.threadType === 'metal_precision'),
    water_flow: threads.filter(t => t.threadType === 'water_flow'),
    creative_fire: threads.filter(t => t.threadType === 'creative_fire'),
    wood_growth: threads.filter(t => t.threadType === 'wood_growth')
  };

  return {
    // State
    threads,
    currentThreadId,
    currentThread,
    currentThreadType,
    currentThreadMessages,
    threadsByType,
    isInThread: !!currentThreadId,
    loading,
    error,

    // Actions
    createThread,
    addMessageToThread,
    switchToThread,
    returnToMain,
    deleteThread,
    renameThread,
    toggleThreadMessageReaction,

    // Utilities
    detectThreadEnergy,
    THREAD_TYPES
  };
}

export default useThreading;
