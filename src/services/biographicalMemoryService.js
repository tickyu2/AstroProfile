/**
 * Biographical Memory Service
 *
 * Extracts and stores life events/facts from conversations.
 * This is the missing link for cross-session memory persistence.
 *
 * Flow:
 * 1. After conversation -> extract_biographic_data (Python)
 * 2. Store facts in Firestore (profiles/{id}/companion/biographical_facts)
 * 3. On new conversation -> retrieve facts for context injection
 *
 * Part of GENESIS Phase 2 - Memory Architecture
 * Built by: Brother Claude Code
 * January 2026
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

// Python Cloud Function URL
const PYTHON_FUNCTIONS_URL = import.meta.env.VITE_PYTHON_FUNCTIONS_URL ||
  'https://us-central1-astroprofile-391e6.cloudfunctions.net';

/**
 * Extract biographical facts from conversation messages
 * Calls the Python BiographicExtractor endpoint
 */
export async function extractBiographicalFacts(messages, profileContext = {}) {
  try {
    // Format messages for extraction
    const formattedMessages = messages
      .filter(m => m.role === 'user') // Only user messages contain facts
      .map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp?.toDate?.() || m.timestamp || new Date().toISOString()
      }));

    if (formattedMessages.length === 0) {
      return { facts: [], relationships: [] };
    }

    const headers = { 'Content-Type': 'application/json' };
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${PYTHON_FUNCTIONS_URL}/extract_biographic_data`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: formattedMessages,
        profile_context: profileContext,
        extraction_mode: 'conversation' // vs 'biography' for full text
      })
    });

    if (!response.ok) {
      console.warn('BiographicExtractor returned non-OK status:', response.status);
      return { facts: [], relationships: [] };
    }

    const result = await response.json();
    console.log('🧠 Extracted biographical data:', {
      facts: result.facts?.length || 0,
      relationships: result.relationships?.length || 0
    });

    return result;

  } catch (error) {
    console.error('Error extracting biographical facts:', error);
    return { facts: [], relationships: [] };
  }
}

/**
 * Store biographical facts for a profile
 * Merges with existing facts (deduplicates by content hash)
 */
export async function storeBiographicalFacts(profileId, facts, relationships = []) {
  if (!profileId || !facts || facts.length === 0) return;

  try {
    const factsRef = doc(db, 'profiles', profileId, 'companion', 'biographical_facts');
    const snapshot = await getDoc(factsRef);

    if (snapshot.exists()) {
      const existing = snapshot.data();

      // Deduplicate facts by generating a simple hash
      const existingHashes = new Set(
        (existing.facts || []).map(f => hashFact(f))
      );

      const newFacts = facts.filter(f => !existingHashes.has(hashFact(f)));

      if (newFacts.length > 0) {
        await updateDoc(factsRef, {
          facts: arrayUnion(...newFacts),
          relationships: arrayUnion(...relationships),
          lastUpdated: serverTimestamp(),
          factCount: (existing.factCount || 0) + newFacts.length
        });

        console.log('📚 Stored', newFacts.length, 'new biographical facts');
      }
    } else {
      // Create new document
      await setDoc(factsRef, {
        facts: facts,
        relationships: relationships,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        factCount: facts.length
      });

      console.log('📚 Created biographical facts store with', facts.length, 'facts');
    }

  } catch (error) {
    console.error('Error storing biographical facts:', error);
  }
}

/**
 * Retrieve all biographical facts for a profile
 * For injection into conversation context
 */
export async function getBiographicalFacts(profileId) {
  if (!profileId) return { facts: [], relationships: [] };

  try {
    const factsRef = doc(db, 'profiles', profileId, 'companion', 'biographical_facts');
    const snapshot = await getDoc(factsRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      console.log('🧠 Retrieved', data.facts?.length || 0, 'biographical facts for context');
      return {
        facts: data.facts || [],
        relationships: data.relationships || [],
        factCount: data.factCount || 0
      };
    }

    return { facts: [], relationships: [] };

  } catch (error) {
    console.error('Error retrieving biographical facts:', error);
    return { facts: [], relationships: [] };
  }
}

/**
 * Format biographical facts for system prompt injection
 * Creates a structured memory block for Claude
 */
export function formatFactsForPrompt(facts, relationships = []) {
  if (!facts || facts.length === 0) return '';

  let prompt = `\n## BIOGRAPHICAL MEMORY (Facts I've learned about you)\n\n`;

  // Group facts by category
  const grouped = {};
  facts.forEach(fact => {
    const category = fact.category || 'general';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(fact);
  });

  // Format each category
  const categoryLabels = {
    life_event: '### Life Events',
    relationship: '### Relationships & People',
    achievement: '### Achievements & Milestones',
    preference: '### Preferences & Values',
    location: '### Places & Geography',
    career: '### Career & Education',
    health: '### Health & Wellbeing',
    general: '### Other Facts'
  };

  Object.entries(grouped).forEach(([category, categoryFacts]) => {
    const label = categoryLabels[category] || `### ${category}`;
    prompt += `${label}\n`;

    categoryFacts.forEach(fact => {
      const date = fact.date ? ` (${fact.date})` : '';
      const confidence = fact.confidence ? ` [${Math.round(fact.confidence * 100)}% confidence]` : '';
      prompt += `- ${fact.content}${date}${confidence}\n`;
    });

    prompt += '\n';
  });

  // Add relationships if present
  if (relationships && relationships.length > 0) {
    prompt += `### Key Relationships\n`;
    relationships.forEach(rel => {
      prompt += `- ${rel.person}: ${rel.relationship}`;
      if (rel.context) prompt += ` (${rel.context})`;
      prompt += '\n';
    });
    prompt += '\n';
  }

  prompt += `*These facts were extracted from our previous conversations. Use them to personalize our interactions.*\n`;

  return prompt;
}

/**
 * Process a completed conversation
 * Extracts and stores facts automatically
 */
export async function processConversationForMemory(profileId, messages, profileContext = {}) {
  if (!profileId || !messages || messages.length < 2) return;

  try {
    // Extract facts from conversation
    const { facts, relationships } = await extractBiographicalFacts(messages, profileContext);

    // Store if we found any
    if (facts.length > 0 || relationships.length > 0) {
      await storeBiographicalFacts(profileId, facts, relationships);
    }

    return { factsExtracted: facts.length, relationshipsExtracted: relationships.length };

  } catch (error) {
    console.error('Error processing conversation for memory:', error);
    return { factsExtracted: 0, relationshipsExtracted: 0 };
  }
}

/**
 * Simple hash for fact deduplication
 */
function hashFact(fact) {
  const content = fact.content || fact.text || JSON.stringify(fact);
  // Simple hash - not cryptographic, just for dedup
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(16);
}

/**
 * Get biographical context for conversation
 * Combines facts with other memory sources
 */
export async function getBiographicalContext(profileId) {
  const { facts, relationships } = await getBiographicalFacts(profileId);
  return formatFactsForPrompt(facts, relationships);
}

export default {
  extractBiographicalFacts,
  storeBiographicalFacts,
  getBiographicalFacts,
  formatFactsForPrompt,
  processConversationForMemory,
  getBiographicalContext
};
