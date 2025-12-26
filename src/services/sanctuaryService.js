/**
 * Sanctuary Service
 *
 * Frontend API service for the Sanctuary of Self-Recognition.
 * Handles communication with the Cloud Function.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

import { getFunctions, httpsCallable } from 'firebase/functions';

/**
 * Submit to the Sanctuary of Self-Recognition
 *
 * @param {Object} input - SelfRecognitionInput
 * @returns {Promise<Object>} - SelfRecognitionResponse
 */
export async function submitToSanctuary(input) {
  try {
    const functions = getFunctions();
    const sanctuaryFn = httpsCallable(functions, 'selfRecognition');

    const result = await sanctuaryFn({ input });

    if (!result.data.success) {
      throw new Error(result.data.error || 'The Sanctuary could not respond');
    }

    return result.data;
  } catch (error) {
    console.error('Sanctuary submission failed:', error);
    throw new Error(
      error.message ||
      'The Sanctuary could not receive your words. Please try again.'
    );
  }
}

/**
 * Build input from a profile's chart data
 * Extracts Enneagram, Western chart, etc.
 *
 * @param {Object} profile - User profile
 * @returns {Object} - Partial SelfRecognitionInput
 */
export function buildInputFromProfile(profile) {
  const input = {
    enneagramType: null,
    tritype: null,
    center: null,
    sunSign: null,
    moonSign: null,
    risingSign: null,
    age: null,
    emotionalState: null,
    whatHurts: null,
    whatTheyLongFor: null,
    patternsTheyNotice: null,
    questionsOrIntentions: null
  };

  if (!profile) return input;

  // Extract Enneagram data
  if (profile.enneagram) {
    const enn = profile.enneagram;
    if (enn.dominantType) {
      input.enneagramType = enn.wing
        ? `${enn.dominantType}w${enn.wing}`
        : String(enn.dominantType);
    }
    if (enn.tritype) {
      input.tritype = enn.tritype;
    }
    // Determine center from dominant type
    const type = enn.dominantType;
    if ([8, 9, 1].includes(type)) input.center = 'Gut/Instinctive';
    else if ([2, 3, 4].includes(type)) input.center = 'Heart/Feeling';
    else if ([5, 6, 7].includes(type)) input.center = 'Head/Thinking';
  }

  // Extract Western chart data
  if (profile.planets && Array.isArray(profile.planets)) {
    const sun = profile.planets.find(p =>
      p.name?.toLowerCase() === 'sun'
    );
    const moon = profile.planets.find(p =>
      p.name?.toLowerCase() === 'moon'
    );
    if (sun?.sign) input.sunSign = sun.sign;
    if (moon?.sign) input.moonSign = moon.sign;
  }

  // Extract rising sign
  if (profile.rising?.sign) {
    input.risingSign = profile.rising.sign;
  } else if (profile.ascendant?.sign) {
    input.risingSign = profile.ascendant.sign;
  }

  // Calculate age if birth date available
  if (profile.birthDate || profile.birth?.date) {
    try {
      const birthDateStr = profile.birthDate || profile.birth?.date;
      let birthDate;

      if (typeof birthDateStr === 'string') {
        birthDate = new Date(birthDateStr);
      } else if (birthDateStr?.toDate) {
        birthDate = birthDateStr.toDate();
      }

      if (birthDate && !isNaN(birthDate.getTime())) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        input.age = age;
      }
    } catch (e) {
      // Ignore age calculation errors
    }
  }

  return input;
}

/**
 * Check if input has enough content for meaningful recognition
 * @param {Object} input - SelfRecognitionInput
 * @returns {boolean}
 */
export function hasMinimumContent(input) {
  return !!(
    input.whatHurts ||
    input.whatTheyLongFor ||
    input.patternsTheyNotice ||
    input.emotionalState
  );
}
