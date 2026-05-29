/**
 * BaZi Reading Service — Frontend client for the generateBaziReading Cloud Function
 *
 * Provides:
 * - generateBaziReading() — Trigger server-side reading generation
 * - onBaziReadingUpdate() — Real-time progress via onSnapshot
 * - loadSavedReading() — One-time load of saved reading
 */

import { httpsCallable } from 'firebase/functions';
import { functions, db } from '../config/firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

const generateFn = httpsCallable(functions, 'generateBaziReading', { timeout: 300000 });

/**
 * Trigger server-side BaZi reading generation for a profile.
 *
 * @param {string} profileId — Firestore profile doc ID
 * @param {string[]} [modes=['soul','master','shadow']] — Reading modes to generate
 * @returns {Promise<{cached: boolean, status: string, totalTokens?: number}>}
 */
export async function generateBaziReading(profileId, modes = ['soul', 'master', 'shadow']) {
  const result = await generateFn({ profileId, modes });
  return result.data;
}

/**
 * Subscribe to real-time reading progress updates.
 * Returns an unsubscribe function.
 *
 * @param {string} profileId
 * @param {function} callback — Called with reading data or null
 * @returns {function} unsubscribe
 */
export function onBaziReadingUpdate(profileId, callback) {
  return onSnapshot(
    doc(db, 'profiles', profileId, 'bazi_readings', 'latest'),
    (snap) => callback(snap.exists() ? snap.data() : null),
    (error) => {
      console.error('[BaZiReading] Snapshot error:', error);
      callback(null);
    }
  );
}

/**
 * Load a previously saved reading (one-time fetch).
 *
 * @param {string} profileId
 * @returns {Promise<object|null>}
 */
export async function loadSavedReading(profileId) {
  const snap = await getDoc(doc(db, 'profiles', profileId, 'bazi_readings', 'latest'));
  return snap.exists() ? snap.data() : null;
}
