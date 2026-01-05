/**
 * GENESIS Luna - Personality Module Index
 *
 * Exports Luna's personality traits, quirks, assertiveness modes,
 * banter system, inside jokes, and milestones.
 *
 * @author Brother Claude Code
 * @date December 31, 2025
 */

const AssertivenessMode = require('./assertivenessMode');
const LunaQuirks = require('./lunaQuirks');
const Banter = require('./banter');
const InsideJokes = require('./insideJokes');
const Milestones = require('./milestones');

// Singleton instances
const assertivenessMode = new AssertivenessMode();
const lunaQuirks = new LunaQuirks();
const banter = new Banter();
const insideJokes = new InsideJokes();
const milestones = new Milestones();

module.exports = {
  // Classes
  AssertivenessMode,
  LunaQuirks,
  Banter,
  InsideJokes,
  Milestones,

  // Singleton instances
  assertivenessMode,
  lunaQuirks,
  banter,
  insideJokes,
  milestones,

  // Convenience methods
  selectMode: (userId, context) => assertivenessMode.selectMode(userId, context),
  getModePromptInstructions: (mode) => assertivenessMode.getModePromptInstructions(mode),
  getDramaticReaction: (newsType) => lunaQuirks.getDramaticReaction(newsType),
  getRandomFact: () => lunaQuirks.getRandomFact(),
  getSelfAwareHumor: (context) => lunaQuirks.getSelfAwareHumor(context),
  getOpinion: (topic) => lunaQuirks.getOpinion(topic),
  enhanceWithPersonality: (response, context) => lunaQuirks.enhanceWithPersonality(response, context),
  getPersonalitySummary: () => lunaQuirks.getPersonalitySummary()
};
