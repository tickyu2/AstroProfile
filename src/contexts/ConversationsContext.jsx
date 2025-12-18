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
  const [activeProfileId, setActiveProfileId] = useState(null); // Per-profile conversations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for conversations
  // Re-run when profileId changes to load different profile's conversations
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setActiveConversationId(null);
      setLoading(false);
      return;
    }

    // Wait for profileId before loading conversations
    // This ensures per-profile conversation isolation
    if (!activeProfileId) {
      setConversations([]);
      setActiveConversationId(null);
      setLoading(true); // Keep loading until profile is set
      return;
    }

    // Reset active conversation when switching profiles
    setActiveConversationId(null);

    // Query all user's conversations (single where = no index needed)
    // Filter by profileId client-side to avoid composite index requirement
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', currentUser.uid)
    );

    let migrationAttempted = false;

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        // Get all conversations for this user
        const allConvs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          // Convert Firestore timestamps to ISO strings
          createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || docSnap.data().createdAt,
          updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || docSnap.data().updatedAt
        }));

        // Check for legacy conversations (no profileId) - migrate them first
        const legacyConvs = allConvs.filter(c => !c.profileId);
        if (legacyConvs.length > 0 && !migrationAttempted) {
          migrationAttempted = true;
          console.log('🔄 Found', legacyConvs.length, 'legacy conversations, migrating...');

          // Migrate legacy conversations to current profile
          for (const conv of legacyConvs) {
            try {
              await updateDoc(doc(db, 'conversations', conv.id), {
                profileId: activeProfileId
              });
            } catch (err) {
              console.error('Migration error for', conv.id, err);
            }
          }
          console.log('✅ Migration complete!');
          // onSnapshot will fire again with updated data
          return;
        }

        // Filter to only conversations for active profile
        const convs = allConvs.filter(c => c.profileId === activeProfileId);

        // Sort client-side by updatedAt descending (most recent first)
        convs.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
          const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
          return dateB - dateA;
        });

        console.log('💬 Conversations loaded:', convs.length, 'for profile:', activeProfileId);
        setConversations(convs);

        // Set active conversation to most recent if not set
        if (convs.length > 0) {
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
  }, [currentUser, activeProfileId]);

  // Get active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const messages = activeConversation?.messages || [DEFAULT_MESSAGE];

  // Create new conversation
  const createConversation = useCallback(async (title = 'New Conversation') => {
    if (!currentUser || !activeProfileId) return null;

    try {
      setError(null);

      const conversation = {
        userId: currentUser.uid,
        profileId: activeProfileId, // Per-profile isolation
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
  }, [currentUser, activeProfileId]);

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

  // Toggle star/favorite on a message
  const toggleMessageStar = useCallback(async (messageId) => {
    if (!activeConversationId) return;

    try {
      setError(null);

      // Find the message and toggle the star
      const updatedMessages = messages.map(msg => {
        if (msg.id === messageId) {
          return { ...msg, starred: !msg.starred };
        }
        return msg;
      });

      await updateMessages(updatedMessages);
      const msg = messages.find(m => m.id === messageId);
      console.log('⭐ Star toggled:', !msg?.starred, 'on message:', messageId);
    } catch (err) {
      console.error('Error toggling star:', err);
      setError(err.message);
      throw err;
    }
  }, [activeConversationId, messages, updateMessages]);

  // Get all starred messages across all conversations
  const getStarredMessages = useCallback(() => {
    const starredMsgs = [];
    conversations.forEach(conv => {
      const convMessages = conv.messages || [];
      convMessages.forEach(msg => {
        if (msg.starred) {
          starredMsgs.push({
            ...msg,
            conversationId: conv.id,
            conversationTitle: conv.title
          });
        }
      });
    });
    // Sort by timestamp descending (most recent first)
    starredMsgs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return starredMsgs;
  }, [conversations]);

  // Search across all conversations
  // Returns array of { message, conversationId, conversationTitle, matchContext }
  const searchConversations = useCallback((query) => {
    if (!query || query.trim().length < 2) return [];

    const searchTerm = query.toLowerCase().trim();
    const results = [];

    conversations.forEach(conv => {
      const convMessages = conv.messages || [];
      convMessages.forEach(msg => {
        const text = msg.text || '';
        const lowerText = text.toLowerCase();

        if (lowerText.includes(searchTerm)) {
          // Find the match position for context highlighting
          const matchIndex = lowerText.indexOf(searchTerm);
          const contextStart = Math.max(0, matchIndex - 40);
          const contextEnd = Math.min(text.length, matchIndex + searchTerm.length + 60);

          // Build context with ellipsis
          let matchContext = '';
          if (contextStart > 0) matchContext += '...';
          matchContext += text.slice(contextStart, contextEnd);
          if (contextEnd < text.length) matchContext += '...';

          results.push({
            ...msg,
            conversationId: conv.id,
            conversationTitle: conv.title,
            matchContext,
            matchIndex,
            searchTerm
          });
        }
      });
    });

    // Sort by timestamp descending (most recent first)
    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return results;
  }, [conversations]);

  // Create initial conversation if none exist for this profile
  useEffect(() => {
    if (!loading && currentUser && activeProfileId && conversations.length === 0) {
      createConversation();
    }
  }, [loading, currentUser, activeProfileId, conversations.length, createConversation]);

  const value = {
    conversations,
    activeConversation,
    activeConversationId,
    activeProfileId,
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
    setActiveProfileId, // Allow pages to set which profile conversations to load
    toggleMessageReaction,
    toggleMessageStar,   // Star/favorite messages
    getStarredMessages,  // Get all starred messages across conversations
    searchConversations  // Search across all conversations
  };

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

export default ConversationsContext;
