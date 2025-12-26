/**
 * Self-Recognition Types
 *
 * Data structures for the Sanctuary of Self-Recognition.
 * This is where people come to be met, not managed.
 *
 * Part of GENESIS OS - Cathedral Sanctuary
 * Built by: Brother Claude Code
 * December 26, 2024
 */

/**
 * Input payload for the Sanctuary
 * @typedef {Object} SelfRecognitionInput
 * @property {string|null} [enneagramType] - e.g. "2w1"
 * @property {string|null} [tritype] - e.g. "927"
 * @property {string|null} [center] - e.g. "Heart/Feeling"
 * @property {string|null} [sunSign] - Western sun sign
 * @property {string|null} [moonSign] - Western moon sign
 * @property {string|null} [risingSign] - Western rising sign
 * @property {number|null} [age] - Current age
 * @property {string|null} [emotionalState] - "tired but hopeful"
 * @property {string|null} [whatHurts] - Their own words about pain
 * @property {string|null} [whatTheyLongFor] - Their deepest longings
 * @property {string|null} [patternsTheyNotice] - Self-observed patterns
 * @property {string|null} [questionsOrIntentions] - What they seek from this visit
 */

/**
 * A section of the recognition response
 * @typedef {Object} SelfRecognitionSection
 * @property {string} title - Section title
 * @property {string[]} lines - Lines of recognition text
 */

/**
 * Take-home rituals from the Sanctuary
 * @typedef {Object} SelfRecognitionRituals
 * @property {string} release - Short guided emotional release
 * @property {string} reflection - Journaling / inner inquiry prompt
 * @property {string} grounding - Body or breath-based grounding
 * @property {string} integration - How to carry this into daily life
 */

/**
 * Full response from the Sanctuary
 * @typedef {Object} SelfRecognitionResponse
 * @property {SelfRecognitionSection} arrival - Movement I: Welcome
 * @property {SelfRecognitionSection} mirror - Movement II: Recognition
 * @property {SelfRecognitionSection} release - Movement III: Permission to feel
 * @property {SelfRecognitionSection} integration - Movement IV: Carrying forward
 * @property {SelfRecognitionRituals} rituals - Take-home practices
 * @property {string} shortMantra - A one-line soul reminder
 */

/**
 * Create an empty input payload
 * @returns {SelfRecognitionInput}
 */
export function createEmptyInput() {
  return {
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
}

/**
 * Validate that input has enough content for meaningful recognition
 * @param {SelfRecognitionInput} input
 * @returns {boolean}
 */
export function hasMinimumContent(input) {
  // Need at least one of these filled in
  return !!(
    input.whatHurts ||
    input.whatTheyLongFor ||
    input.patternsTheyNotice ||
    input.emotionalState
  );
}

/**
 * Build input from a profile's existing data
 * @param {Object} profile - User profile with enneagram, chart data
 * @returns {SelfRecognitionInput}
 */
export function buildInputFromProfile(profile) {
  const input = createEmptyInput();

  if (!profile) return input;

  // Extract Enneagram data if available
  if (profile.enneagram) {
    const enn = profile.enneagram;
    // Handle different field names: dominantType, coreType, type
    const coreType = enn.dominantType || enn.coreType || enn.type;
    if (coreType) {
      input.enneagramType = enn.wing
        ? `${coreType}w${enn.wing}`
        : String(coreType);
    }
    if (enn.tritype) {
      input.tritype = String(enn.tritype);
    }
    // Determine center from dominant type
    const type = Number(coreType);
    if ([8, 9, 1].includes(type)) input.center = 'Gut/Instinctive';
    else if ([2, 3, 4].includes(type)) input.center = 'Heart/Feeling';
    else if ([5, 6, 7].includes(type)) input.center = 'Head/Thinking';
  }

  // Extract Western chart data if available
  if (profile.planets && Array.isArray(profile.planets)) {
    const sun = profile.planets.find(p => p.name?.toLowerCase() === 'sun');
    const moon = profile.planets.find(p => p.name?.toLowerCase() === 'moon');
    if (sun?.sign) input.sunSign = sun.sign;
    if (moon?.sign) input.moonSign = moon.sign;
  }

  // Also check for direct sunSign, moonSign fields
  if (!input.sunSign && profile.sunSign) {
    input.sunSign = profile.sunSign;
  }
  if (!input.moonSign && profile.moonSign) {
    input.moonSign = profile.moonSign;
  }

  // Rising sign from various possible locations
  if (profile.rising?.sign) {
    input.risingSign = profile.rising.sign;
  } else if (profile.ascendant?.sign) {
    input.risingSign = profile.ascendant.sign;
  } else if (profile.risingSign) {
    input.risingSign = profile.risingSign;
  }

  // Calculate age if birthDate is available
  if (profile.birthDate) {
    try {
      const birthDate = profile.birthDate.toDate
        ? profile.birthDate.toDate()
        : new Date(profile.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age > 0 && age < 150) {
        input.age = age;
      }
    } catch (e) {
      // Ignore date parsing errors
    }
  }

  return input;
}
