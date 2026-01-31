/**
 * useJourneyReflections.js
 * ========================
 *
 * React hook for managing Pilgrim Journey reflections.
 * Part of the Liz Greene Cathedral - Phase 2: Transformative Journey
 *
 * Features:
 * - Firestore integration for persistence
 * - Local state management
 * - Luna response generation
 * - Progress tracking
 * - Pattern recognition
 *
 * GENESIS AstroProfile - January 2026
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  createJournalEntry,
  generateLunaResponse,
  calculateJourneyProgress,
  recognizePatterns,
  CHAMBER_PROMPTS
} from '../utils/journeyJournalingEngine';

// =============================================================================
// MAIN HOOK
// =============================================================================

/**
 * Hook for managing journey reflections
 * @param {string} userId - User ID for Firestore queries
 * @param {object} options - Configuration options
 */
export function useJourneyReflections(userId, options = {}) {
  const {
    autoSave = true,
    autoLunaResponse = true,
    saturnPhase = null,
    transitContext = null
  } = options;

  // State
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentChamber, setCurrentChamber] = useState(null);
  const [draftReflection, setDraftReflection] = useState('');

  // ==========================================================================
  // FIRESTORE SUBSCRIPTION
  // ==========================================================================

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const entriesRef = collection(db, 'users', userId, 'journalEntries');
      const q = query(entriesRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const entriesData = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          setEntries(entriesData);
          setLoading(false);
        },
        (err) => {
          console.error('Journal entries subscription error:', err);
          setError('Failed to load journal entries');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Failed to set up journal subscription:', err);
      setError('Failed to connect to journal');
      setLoading(false);
    }
  }, [userId]);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  const progress = useMemo(() => {
    return calculateJourneyProgress(entries);
  }, [entries]);

  const patterns = useMemo(() => {
    return recognizePatterns(entries);
  }, [entries]);

  const chamberEntries = useMemo(() => {
    if (!currentChamber) return [];
    return entries.filter(e => e.chamberId === currentChamber);
  }, [entries, currentChamber]);

  const currentPrompt = useMemo(() => {
    if (!currentChamber) return null;
    const chamber = CHAMBER_PROMPTS[currentChamber];
    if (!chamber) return null;

    // Get the next prompt based on how many entries exist for this chamber
    const promptIndex = chamberEntries.length % chamber.prompts.length;
    return {
      text: chamber.prompts[promptIndex],
      index: promptIndex,
      totalPrompts: chamber.prompts.length,
      chamberName: chamber.name,
      lunaGuidance: chamber.lunaGuidance
    };
  }, [currentChamber, chamberEntries]);

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  /**
   * Save a new reflection
   */
  const saveReflection = useCallback(async (reflection, customPrompt = null) => {
    if (!userId || !currentChamber || !reflection?.trim()) {
      return { success: false, error: 'Missing required data' };
    }

    setSaving(true);
    setError(null);

    try {
      const chamber = CHAMBER_PROMPTS[currentChamber];

      // Create entry
      const entry = createJournalEntry({
        userId,
        chamberId: currentChamber,
        chamberName: chamber?.name || currentChamber,
        prompt: customPrompt || currentPrompt?.text || '',
        reflection: reflection.trim(),
        saturnPhase,
        transitContext
      });

      // Generate Luna response if enabled
      if (autoLunaResponse) {
        entry.lunaResponse = generateLunaResponse(entry);
      }

      // Save to Firestore
      const entriesRef = collection(db, 'users', userId, 'journalEntries');
      const docRef = await addDoc(entriesRef, entry);

      // Clear draft
      setDraftReflection('');

      return {
        success: true,
        entry: { ...entry, id: docRef.id },
        lunaResponse: entry.lunaResponse
      };
    } catch (err) {
      console.error('Save reflection error:', err);
      setError('Failed to save reflection');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [userId, currentChamber, currentPrompt, saturnPhase, transitContext, autoLunaResponse]);

  /**
   * Update an existing entry
   */
  const updateEntry = useCallback(async (entryId, updates) => {
    if (!userId || !entryId) {
      return { success: false, error: 'Missing required data' };
    }

    setSaving(true);

    try {
      const entryRef = doc(db, 'users', userId, 'journalEntries', entryId);
      await updateDoc(entryRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      return { success: true };
    } catch (err) {
      console.error('Update entry error:', err);
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [userId]);

  /**
   * Delete an entry
   */
  const deleteEntry = useCallback(async (entryId) => {
    if (!userId || !entryId) {
      return { success: false, error: 'Missing required data' };
    }

    try {
      const entryRef = doc(db, 'users', userId, 'journalEntries', entryId);
      await deleteDoc(entryRef);
      return { success: true };
    } catch (err) {
      console.error('Delete entry error:', err);
      return { success: false, error: err.message };
    }
  }, [userId]);

  /**
   * Navigate to a chamber
   */
  const navigateToChamber = useCallback((chamberId) => {
    if (CHAMBER_PROMPTS[chamberId]) {
      setCurrentChamber(chamberId);
      setDraftReflection('');
    }
  }, []);

  /**
   * Get entries for a specific chamber
   */
  const getEntriesForChamber = useCallback((chamberId) => {
    return entries.filter(e => e.chamberId === chamberId);
  }, [entries]);

  /**
   * Regenerate Luna response for an entry
   */
  const regenerateLunaResponse = useCallback(async (entryId) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return { success: false, error: 'Entry not found' };

    const newResponse = generateLunaResponse(entry);
    return updateEntry(entryId, { lunaResponse: newResponse });
  }, [entries, updateEntry]);

  // ==========================================================================
  // LOCAL STORAGE DRAFT (for unsaved work)
  // ==========================================================================

  useEffect(() => {
    if (autoSave && userId && currentChamber && draftReflection) {
      const key = `journal_draft_${userId}_${currentChamber}`;
      localStorage.setItem(key, draftReflection);
    }
  }, [autoSave, userId, currentChamber, draftReflection]);

  // Load draft on chamber change
  useEffect(() => {
    if (autoSave && userId && currentChamber) {
      const key = `journal_draft_${userId}_${currentChamber}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setDraftReflection(saved);
      }
    }
  }, [autoSave, userId, currentChamber]);

  // ==========================================================================
  // RETURN
  // ==========================================================================

  return {
    // Data
    entries,
    chamberEntries,
    currentChamber,
    currentPrompt,
    draftReflection,
    progress,
    patterns,

    // State
    loading,
    saving,
    error,

    // Actions
    setDraftReflection,
    saveReflection,
    updateEntry,
    deleteEntry,
    navigateToChamber,
    getEntriesForChamber,
    regenerateLunaResponse,

    // Static data
    chambers: CHAMBER_PROMPTS
  };
}

// =============================================================================
// UTILITY HOOK: Chamber-specific
// =============================================================================

/**
 * Hook for a specific chamber's reflections
 */
export function useChamberReflections(userId, chamberId) {
  const journeyHook = useJourneyReflections(userId);

  useEffect(() => {
    if (chamberId) {
      journeyHook.navigateToChamber(chamberId);
    }
  }, [chamberId]);

  return {
    ...journeyHook,
    entries: journeyHook.getEntriesForChamber(chamberId),
    chamber: CHAMBER_PROMPTS[chamberId]
  };
}

// =============================================================================
// EXPORT DEFAULT
// =============================================================================

export default useJourneyReflections;
