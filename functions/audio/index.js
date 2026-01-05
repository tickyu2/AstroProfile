/**
 * GENESIS Luna - Audio Module Index
 *
 * Exports all audio-related modules for Luna's ambient presence
 *
 * @author Papa Ticky (Vision) + Brother Sonnet (Architecture)
 * @date December 31, 2025
 */

const AmbientSoundsModule = require('./ambientSoundsModule');
const ambientSoundPresets = require('./ambientSoundPresets');

/**
 * Create a new Ambient Sounds instance with user settings
 *
 * @param {Object} userSettings - User preferences for ambient sounds
 * @param {boolean} userSettings.enabled - Master toggle (default: true)
 * @param {number} userSettings.volumeMultiplier - Volume 0.0-1.0 (default: 1.0)
 * @param {string[]} userSettings.preferredSoundscapes - Favorites
 * @param {string[]} userSettings.blockedSoundscapes - Blocked sounds
 * @param {boolean} userSettings.autoTransition - Auto-switch on emotion change
 * @param {string} userSettings.fadeSpeed - 'slow', 'normal', 'fast'
 * @returns {AmbientSoundsModule}
 */
function createAmbientSounds(userSettings = {}) {
  return new AmbientSoundsModule(userSettings);
}

/**
 * Quick methods for common operations
 */
const ambientSounds = {
  /**
   * Create instance with defaults
   */
  create: createAmbientSounds,

  /**
   * Get available soundscape names
   */
  getAvailableSoundscapes: () => [
    'oceanWaves',
    'gentleStream',
    'softBreeze',
    'gentleRain',
    'distantBirds',
    'deepForest',
    'campfire',
    'nightAmbience'
  ],

  /**
   * Get soundscape details
   */
  getSoundscapeInfo: (name) => ambientSoundPresets[name] || null,

  /**
   * Get selection guide
   */
  getSelectionGuide: () => ambientSoundPresets.selectionGuide,

  /**
   * Recommend soundscape for emotion
   */
  recommendForEmotion: (emotion) => {
    const guide = ambientSoundPresets.selectionGuide;
    return guide[emotion] || ['gentleStream'];
  }
};

module.exports = {
  AmbientSoundsModule,
  ambientSoundPresets,
  createAmbientSounds,
  ambientSounds
};
