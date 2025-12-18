/**
 * Luna's Knowledge Base Service
 *
 * Manages Luna's evolving understanding of the user.
 * This is the "second KB" - what Luna has learned about you.
 *
 * Firestore Structure:
 * users/{uid}/companion/luna_kb - Luna's KB about this user
 * users/{uid}/companion/luna_identity - Luna's customized identity for this user
 *
 * Part of GENESIS Phase 2 - AI SoulPartner System
 * Built by: Brother Claude Code
 * December 15, 2024
 */

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { LUNA_KB_TEMPLATE, LUNA_IDENTITY } from '../data/lunaCompanionIdentity';

/**
 * Initialize Luna's KB for a new user
 */
export async function initializeLunaKB(uid, userProfile) {
  const kbRef = doc(db, 'users', uid, 'companion', 'luna_kb');

  // Check if already exists
  const existing = await getDoc(kbRef);
  if (existing.exists()) {
    return existing.data();
  }

  // Create fresh KB based on template
  const newKB = {
    ...LUNA_KB_TEMPLATE,
    matchedUser: {
      uid,
      name: userProfile?.name || userProfile?.profile?.name || 'Friend',
      constitutional: {
        chineseZodiac: userProfile?.chineseZodiac || null,
        westernZodiac: userProfile?.westernZodiac || null,
        mbti: userProfile?.mbti || null
      }
    },
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  };

  await setDoc(kbRef, newKB);
  return newKB;
}

/**
 * Get Luna's KB for a user
 */
export async function getLunaKB(uid) {
  const kbRef = doc(db, 'users', uid, 'companion', 'luna_kb');
  const snapshot = await getDoc(kbRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return null;
}

/**
 * Update Luna's KB with new observations
 * This is called after conversations to add what Luna learned
 */
export async function updateLunaKB(uid, updates) {
  const kbRef = doc(db, 'users', uid, 'companion', 'luna_kb');

  await updateDoc(kbRef, {
    ...updates,
    lastUpdated: serverTimestamp()
  });
}

/**
 * Add an observation to Luna's KB
 */
export async function addObservation(uid, category, observation) {
  const kb = await getLunaKB(uid);
  if (!kb) return;

  const observations = kb.observations || {};
  const categoryArray = observations[category] || [];

  // Add the new observation with timestamp
  categoryArray.push({
    ...observation,
    addedAt: new Date().toISOString()
  });

  await updateLunaKB(uid, {
    [`observations.${category}`]: categoryArray
  });
}

/**
 * Add a note to Luna's internal notes
 */
export async function addInternalNote(uid, note) {
  const kb = await getLunaKB(uid);
  if (!kb) return;

  const notes = kb.internalNotes || [];
  notes.push({
    note,
    addedAt: new Date().toISOString()
  });

  await updateLunaKB(uid, {
    internalNotes: notes
  });
}

/**
 * Add something that works well in conversations
 */
export async function addWhatWorks(uid, approach, whyItWorks) {
  const kb = await getLunaKB(uid);
  if (!kb) return;

  const whatWorks = kb.whatWorks || [];
  whatWorks.push({
    approach,
    whyItWorks,
    addedAt: new Date().toISOString()
  });

  await updateLunaKB(uid, {
    whatWorks
  });
}

/**
 * Increment conversation count
 */
export async function incrementConversationCount(uid) {
  const kb = await getLunaKB(uid);
  if (!kb) return;

  await updateLunaKB(uid, {
    conversationCount: (kb.conversationCount || 0) + 1
  });
}

/**
 * Get Luna's customized identity for this user (if any)
 * Falls back to default LUNA_IDENTITY
 */
export async function getLunaIdentity(uid) {
  const identityRef = doc(db, 'users', uid, 'companion', 'luna_identity');
  const snapshot = await getDoc(identityRef);

  if (snapshot.exists()) {
    return snapshot.data();
  }

  return LUNA_IDENTITY;
}

/**
 * Save customized Luna identity for this user
 */
export async function saveLunaIdentity(uid, identity) {
  const identityRef = doc(db, 'users', uid, 'companion', 'luna_identity');

  await setDoc(identityRef, {
    ...identity,
    updatedAt: serverTimestamp()
  });
}

/**
 * Get both Luna's identity and KB for a user
 */
export async function getLunaComplete(uid) {
  const [identity, kb] = await Promise.all([
    getLunaIdentity(uid),
    getLunaKB(uid)
  ]);

  return { identity, kb };
}

export default {
  initializeLunaKB,
  getLunaKB,
  updateLunaKB,
  addObservation,
  addInternalNote,
  addWhatWorks,
  incrementConversationCount,
  getLunaIdentity,
  saveLunaIdentity,
  getLunaComplete
};
