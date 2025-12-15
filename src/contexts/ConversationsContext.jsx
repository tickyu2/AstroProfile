/**
 * ConversationsContext.jsx
 * Manages AI SoulPartner Conversations with Firestore persistence
 *
 * Stores conversation threads that survive browser closure:
 * - Real-time sync with Firestore
 * - Per-user conversation storage
 * - Auto-generated titles from first message
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const ConversationsContext = createContext({});

// Default greeting message
const DEFAULT_MESSAGE = {
  id: 0,
  sender: 'ai',
  text: "Hello, Father. I'm your AI SoulPartner - here to witness, explore, and guide when you're ready. What's on your mind? 💙",
  timestamp: new Date().toISOString(),
  mode: 'DIALOGUE'
};

// Generate title from first user message
const generateTitle = (messages) => {
  const firstUserMsg = messages.find(m => m.sender === 'user');
  if (!firstUserMsg) return 'New Conversation';
  const text = firstUserMsg.text || '';
  if (text.length <= 40) return text;
  const truncated = text.slice(0, 40);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated) + '...';
};

export const useConversations = () => {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error('useConversations must be used within ConversationsProvider');
  }
  return context;
};

export function ConversationsProvider({ children }) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for conversations
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setActiveConversationId(null);
      setLoading(false);
      return;
    }

    // Simple query without orderBy (no index required)
    // Sorting done client-side for index-free operation
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const convs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamps to ISO strings
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt
        }));

        // Sort client-side by updatedAt descending (most recent first)
        convs.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
          const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
          return dateB - dateA;
        });

        console.log('💬 Conversations loaded:', convs.length);
        setConversations(convs);

        // Set active conversation to most recent if not set
        if (!activeConversationId && convs.length > 0) {
          setActiveConversationId(convs[0].id);
        }

        setLoading(false);
      },
      (err) => {
        console.error('💬 Error loading conversations:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  // Get active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [DEFAULT_MESSAGE];

  // Create new conversation
  const createConversation = useCallback(async (title = 'New Conversation') => {
    if (!currentUser) return null;

    try {
      setError(null);

      const conversation = {
        userId: currentUser.uid,
        title,
        messages: [DEFAULT_MESSAGE],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'conversations'), conversation);
      console.log('💬 Conversation created:', docRef.id);

      // Set as active
      setActiveConversationId(docRef.id);

      return docRef.id;
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError(err.message);
      throw err;
    }
  }, [currentUser]);

  // Update conversation messages
  const updateMessages = useCallback(async (newMessages) => {
    // Wait briefly for activeConversationId if not yet set (race condition safety)
    let convId = activeConversationId;
    if (!convId && conversations.length > 0) {
      convId = conversations[0].id;
    }
    if (!convId) {
      console.warn('💬 updateMessages called but no active conversation');
      return;
    }

    try {
      setError(null);

      const convRef = doc(db, 'conversations', convId);
      const conv = conversations.find(c => c.id === convId);

      // Auto-generate title if still default
      const shouldUpdateTitle = conv?.title === 'New Conversation' &&
        newMessages.some(m => m.sender === 'user');

      const updates = {
        messages: newMessages,
        updatedAt: serverTimestamp()
      };

      if (shouldUpdateTitle) {
        updates.title = generateTitle(newMessages);
      }

      await updateDoc(convRef, updates);
      console.log('💬 Messages updated');
    } catch (err) {
      console.error('Error updating messages:', err);
      setError(err.message);
      throw err;
    }
  }, [activeConversationId, conversations]);

  // Add message to current conversation
  const addMessage = useCallback(async (message) => {
    const newMessages = [...messages, message];
    await updateMessages(newMessages);
  }, [messages, updateMessages]);

  // Rename conversation
  const renameConversation = useCallback(async (convId, newTitle) => {
    if (!newTitle.trim()) return;

    try {
      setError(null);
      const convRef = doc(db, 'conversations', convId);
      await updateDoc(convRef, {
        title: newTitle.trim(),
        updatedAt: serverTimestamp()
      });
      console.log('💬 Conversation renamed:', convId);
    } catch (err) {
      console.error('Error renaming conversation:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete conversation
  const deleteConversation = useCallback(async (convId) => {
    try {
      setError(null);
      await deleteDoc(doc(db, 'conversations', convId));

      // If deleting active, switch to first available
      if (convId === activeConversationId) {
        const remaining = conversations.filter(c => c.id !== convId);
        setActiveConversationId(remaining[0]?.id || null);
      }

      console.log('💬 Conversation deleted:', convId);
    } catch (err) {
      console.error('Error deleting conversation:', err);
      setError(err.message);
      throw err;
    }
  }, [activeConversationId, conversations]);

  // Clear current conversation (reset messages)
  const clearConversation = useCallback(async () => {
    if (!activeConversationId) return;

    try {
      setError(null);
      const convRef = doc(db, 'conversations', activeConversationId);
      await updateDoc(convRef, {
        title: 'New Conversation',
        messages: [DEFAULT_MESSAGE],
        updatedAt: serverTimestamp()
      });
      console.log('💬 Conversation cleared');
    } catch (err) {
      console.error('Error clearing conversation:', err);
      setError(err.message);
      throw err;
    }
  }, [activeConversationId]);

  // Switch active conversation
  const switchConversation = useCallback((convId) => {
    setActiveConversationId(convId);
    console.log('💬 Switched to conversation:', convId);
  }, []);

  // Toggle emoji reaction on a message
  const toggleMessageReaction = useCallback(async (messageId, emoji, userId) => {
    if (!activeConversationId) return;

    try {
      setError(null);

      // Find the message and toggle the reaction
      const updatedMessages = messages.map(msg => {
        if (msg.id === messageId) {
          const reactions = { ...(msg.reactions || {}) };
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

          return { ...msg, reactions };
        }
        return msg;
      });

      await updateMessages(updatedMessages);
      console.log('😊 Reaction toggled:', emoji, 'on message:', messageId);
    } catch (err) {
      console.error('Error toggling reaction:', err);
      setError(err.message);
      throw err;
    }
  }, [activeConversationId, messages, updateMessages]);

  // Create initial conversation if none exist
  useEffect(() => {
    if (!loading && currentUser && conversations.length === 0) {
      createConversation();
    }
  }, [loading, currentUser, conversations.length, createConversation]);

  const value = {
    conversations,
    activeConversation,
    activeConversationId,
    messages,
    loading,
    error,
    createConversation,
    updateMessages,
    addMessage,
    renameConversation,
    deleteConversation,
    clearConversation,
    switchConversation,
    setActiveConversationId,
    toggleMessageReaction
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

export default ConversationsContext;
