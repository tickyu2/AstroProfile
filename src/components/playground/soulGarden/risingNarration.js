/**
 * Rising Sign Narration System
 *
 * The "global voice" - how the life itself feels from the Ascendant's point of view.
 * This is the Rising Sign singing over the whole life.
 *
 * Part of GENESIS OS - Soul Garden Cathedral
 * Built by: Brother Claude Code
 * December 25, 2024
 */

/**
 * Per-sign narration voices
 * Each returns an array of poetic lines that speak to how this Rising walks through life
 */
const risingVoices = {
  Aries: (slice) => [
    `Your path is written in first steps — each moment invites you to break a new trail.`,
    `Even in quiet times, the Rose Window holds a spark: you are here to ignite beginnings.`
  ],

  Taurus: (slice) => [
    `Your days want to root you in what is real, tangible, and quietly sacred.`,
    `Time itself becomes a garden when you let yourself linger with what you love.`
  ],

  Gemini: (slice) => [
    `Your life speaks in questions and connections — every encounter is a strand in a larger pattern.`,
    `Even in chaos, your mind is weaving stories that want to be shared.`
  ],

  Cancer: (slice) => [
    `Your life flows like tide — drawing you in, sending you out, always shaping you through feeling.`,
    `Home is not a place for you; it's a rhythm your soul is learning to trust.`
  ],

  Leo: (slice) => [
    `Life keeps asking you to stand where the light is strongest, not to prove yourself, but to remember you already shine.`,
    `Every season is another chance for your heart to radiate warmth into a colder world.`
  ],

  Virgo: (slice) => [
    `Your life refines itself through small corrections — each moment an invitation to bring things closer to truth.`,
    `What looks like "fixing" from the outside is really your soul's devotion to coherence.`
  ],

  Libra: (slice) => [
    `Your timeline is a series of mirrors — each chapter showing you a new way to relate.`,
    `Balance is not stillness for you; it's a living dance between self and other.`
  ],

  Scorpio: (slice) => [
    `Your timeline is layered — what others see as simple chapters, your soul knows as initiations.`,
    `Endings are never empty for you; they are the dark soil where your next self is already taking root.`
  ],

  Sagittarius: (slice) => [
    `Your timeline is a long road of horizons — each hour is less a box and more a doorway.`,
    `Even when nothing seems to move, your soul is stretching toward a farther sky.`
  ],

  Capricorn: (slice) => [
    `Your years build like stone — slowly, deliberately, enduringly.`,
    `Even your hardest seasons are scaffolding for a future only your soul can see.`
  ],

  Aquarius: (slice) => [
    `Your days lean toward the future — even when you look back, you are redesigning what's ahead.`,
    `You carry blueprints in your bones; each moment tests which ones are ready to become real.`
  ],

  Pisces: (slice) => [
    `Your days blur into one another like brushstrokes — meaning emerges when you step back.`,
    `Your soul swims in currents others can't see; each moment is both a wave and a prayer.`
  ]
};

/**
 * Get narration lines for a rising sign
 * @param {string} risingSign - The rising sign name (e.g., "Sagittarius")
 * @param {Object} slice - The current timeline slice
 * @returns {string[]} Array of narration lines
 */
export function narrateRising(risingSign, slice) {
  if (!risingSign) return [];

  // Normalize the sign name
  const normalized = risingSign.charAt(0).toUpperCase() + risingSign.slice(1).toLowerCase();
  const fn = risingVoices[normalized];

  if (!fn) return [];
  return fn(slice);
}

/**
 * Get all available rising sign voices
 * @returns {string[]} Array of sign names
 */
export function getAvailableRisingSigns() {
  return Object.keys(risingVoices);
}

/**
 * Check if a rising sign has a voice defined
 * @param {string} risingSign - The rising sign name
 * @returns {boolean} True if voice exists
 */
export function hasRisingVoice(risingSign) {
  if (!risingSign) return false;
  const normalized = risingSign.charAt(0).toUpperCase() + risingSign.slice(1).toLowerCase();
  return !!risingVoices[normalized];
}
