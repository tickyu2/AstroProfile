/**
 * KnowledgeBaseContext.jsx
 * Manages the AI SoulPartner's Knowledge Base
 *
 * Stores markdown documents that Claude can reference:
 * - GENESIS documentation
 * - User preferences
 * - Technical context
 * - Any other knowledge the AI should have
 *
 * Features:
 * - Document CRUD operations
 * - Category-based organization
 * - Priority-based selection for token management
 * - Always-include flags for critical documents
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code (Yin Wood Pig)
 * December 14, 2024
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
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

const KnowledgeBaseContext = createContext({});

// Document categories
export const KNOWLEDGE_CATEGORIES = {
  GENESIS: {
    id: 'genesis',
    label: 'GENESIS Overview',
    icon: '🌟',
    description: 'Core concepts and vision of GENESIS'
  },
  TECHNICAL: {
    id: 'technical',
    label: 'Technical',
    icon: '⚙️',
    description: 'Technical documentation and architecture'
  },
  PERSONAL: {
    id: 'personal',
    label: 'Personal Context',
    icon: '👤',
    description: 'Information about you and your preferences'
  },
  CONSTITUTIONAL: {
    id: 'constitutional',
    label: 'Constitutional Intelligence',
    icon: '☯️',
    description: 'How constitutional patterns work'
  },
  REFERENCE: {
    id: 'reference',
    label: 'Reference',
    icon: '📚',
    description: 'Reference materials and guides'
  }
};

export const useKnowledgeBase = () => {
  const context = useContext(KnowledgeBaseContext);
  if (!context) {
    throw new Error('useKnowledgeBase must be used within KnowledgeBaseProvider');
  }
  return context;
};

export function KnowledgeBaseProvider({ children }) {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Real-time listener for knowledge base documents
  useEffect(() => {
    if (!currentUser) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'knowledgeBase'),
      where('userId', '==', currentUser.uid),
      orderBy('priority', 'desc'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('📚 Knowledge Base loaded:', docs.length, 'documents', docs.map(d => d.title));
        setDocuments(docs);
        setLoading(false);
      },
      (err) => {
        console.error('📚 Error loading knowledge base:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [currentUser]);

  // Create new document
  const createDocument = async (docData) => {
    try {
      setError(null);

      const wordCount = docData.content?.split(/\s+/).length || 0;

      const document = {
        userId: currentUser.uid,
        title: docData.title,
        category: docData.category || 'reference',
        content: docData.content || '',
        summary: docData.summary || '',
        alwaysInclude: docData.alwaysInclude || false,
        priority: docData.priority || 5,
        tags: docData.tags || [],
        wordCount,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'knowledgeBase'), document);
      console.log('📚 Knowledge document created:', docRef.id);

      return { id: docRef.id, ...document };
    } catch (err) {
      console.error('Error creating document:', err);
      setError(err.message);
      throw err;
    }
  };

  // Update document
  const updateDocument = async (docId, updates) => {
    try {
      setError(null);

      const wordCount = updates.content?.split(/\s+/).length || 0;

      const docRef = doc(db, 'knowledgeBase', docId);
      await updateDoc(docRef, {
        ...updates,
        wordCount,
        updatedAt: serverTimestamp()
      });

      console.log('📚 Knowledge document updated:', docId);
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err.message);
      throw err;
    }
  };

  // Delete document
  const deleteDocument = async (docId) => {
    try {
      setError(null);
      await deleteDoc(doc(db, 'knowledgeBase', docId));
      console.log('📚 Knowledge document deleted:', docId);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.message);
      throw err;
    }
  };

  // Get documents for Claude (respects token limits)
  const getDocumentsForContext = (options = {}) => {
    const {
      maxTokens = 4000, // Approximate token limit for knowledge
      categories = null, // Filter by specific categories
      includeAll = false // Include all docs regardless of flags
    } = options;

    let selectedDocs = [...documents];

    // Filter by categories if specified
    if (categories && categories.length > 0) {
      selectedDocs = selectedDocs.filter(d => categories.includes(d.category));
    }

    // Sort by priority and always-include flag
    selectedDocs.sort((a, b) => {
      if (a.alwaysInclude && !b.alwaysInclude) return -1;
      if (!a.alwaysInclude && b.alwaysInclude) return 1;
      return (b.priority || 5) - (a.priority || 5);
    });

    // If includeAll, return everything
    if (includeAll) {
      return selectedDocs;
    }

    // Select docs respecting token limits (rough estimate: 1 word ≈ 1.3 tokens)
    const result = [];
    let estimatedTokens = 0;

    for (const doc of selectedDocs) {
      const docTokens = Math.ceil((doc.wordCount || 0) * 1.3);

      // Always include docs marked as such
      if (doc.alwaysInclude) {
        result.push(doc);
        estimatedTokens += docTokens;
        continue;
      }

      // Check if we have room for this document
      if (estimatedTokens + docTokens <= maxTokens) {
        result.push(doc);
        estimatedTokens += docTokens;
      }
    }

    console.log(`📚 Selected ${result.length}/${documents.length} docs for context (~${estimatedTokens} tokens)`);
    return result;
  };

  // Build knowledge prompt for Claude
  const buildKnowledgePrompt = (options = {}) => {
    // DEBUG: Log documents state
    console.log('📚 buildKnowledgePrompt called:', {
      totalDocuments: documents.length,
      documentTitles: documents.map(d => d.title),
      loading
    });

    const docs = getDocumentsForContext(options);

    if (docs.length === 0) {
      console.log('📚 No documents selected for context!');
      return '';
    }

    let prompt = `## KNOWLEDGE BASE

The following documents contain important context and information:

`;

    docs.forEach((doc, index) => {
      const categoryInfo = Object.values(KNOWLEDGE_CATEGORIES).find(c => c.id === doc.category);
      prompt += `### ${index + 1}. ${doc.title} ${categoryInfo?.icon || '📄'}
**Category:** ${categoryInfo?.label || doc.category}
${doc.summary ? `**Summary:** ${doc.summary}\n` : ''}
${doc.content}

---

`;
    });

    return prompt;
  };

  // Get stats
  const getStats = () => {
    const totalDocs = documents.length;
    const totalWords = documents.reduce((sum, d) => sum + (d.wordCount || 0), 0);
    const alwaysIncludeCount = documents.filter(d => d.alwaysInclude).length;

    const byCategory = {};
    documents.forEach(d => {
      byCategory[d.category] = (byCategory[d.category] || 0) + 1;
    });

    return {
      totalDocs,
      totalWords,
      estimatedTokens: Math.ceil(totalWords * 1.3),
      alwaysIncludeCount,
      byCategory
    };
  };

  const value = {
    documents,
    loading,
    error,
    categories: KNOWLEDGE_CATEGORIES,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentsForContext,
    buildKnowledgePrompt,
    getStats
  };

  return (
    <KnowledgeBaseContext.Provider value={value}>
      {children}
    </KnowledgeBaseContext.Provider>
  );
}

export default KnowledgeBaseContext;
