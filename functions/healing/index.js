/**
 * GENESIS Luna - Healing Module Index
 *
 * Exports the Bathtub Healing algorithm and Stack Executor
 * for happiness memory stacking.
 *
 * The bathtub metaphor:
 * - Salt = grief (cannot be removed)
 * - Water = happiness memories (can be added)
 * - Dilution = healing through positive experiences
 *
 * @author Brother Claude Code
 * @date December 31, 2025
 */

const BathtubCalculator = require('./bathtubCalculator');
const StackExecutor = require('./stackExecutor');

// Singleton instances
const bathtubCalculator = new BathtubCalculator();
const stackExecutor = new StackExecutor();

module.exports = {
  // Classes
  BathtubCalculator,
  StackExecutor,

  // Singleton instances
  bathtubCalculator,
  stackExecutor,

  // Convenience methods
  calculateState: (concentration) => bathtubCalculator.calculateState(concentration),
  calculateConcentration: (salt, water) => bathtubCalculator.calculateConcentration(salt, water),
  executeStack: (salt, water, anchors) => bathtubCalculator.executeStack(salt, water, anchors),
  executePartialStack: (salt, water, anchors) => bathtubCalculator.executePartialStack(salt, water, anchors),
  addSalt: (currentSalt, intensity) => bathtubCalculator.addSalt(currentSalt, intensity),
  estimateStacksToTarget: (salt, water, target) => bathtubCalculator.estimateStacksToTarget(salt, water, target),
  getStateDescription: (state) => bathtubCalculator.getStateDescription(state)
};
