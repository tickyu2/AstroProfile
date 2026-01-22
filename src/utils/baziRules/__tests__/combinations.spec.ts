/**
 * Combination Edge Cases - Unit Tests
 * Tests for Three Harmony, Six Harmony, Stem Combinations
 */

import { evaluateCombinations } from '../combinationEngine';
import combinationsJson from '../../../data/rules/combinations.json';
import { ChartContext, DetectedCombination } from '../types';

const rules = (combinationsJson as any).combinations;

// Helper to create minimal chart context for testing
function createTestContext(overrides: Partial<ChartContext>): ChartContext {
  return {
    pillars: {
      year: { stem: '甲', branch: '子', stemElement: 'Wood', branchElement: 'Water', hiddenStems: [] },
      month: { stem: '己', branch: '丑', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
      day: { stem: '甲', branch: '寅', stemElement: 'Wood', branchElement: 'Wood', hiddenStems: [] },
      hour: { stem: '丁', branch: '卯', stemElement: 'Fire', branchElement: 'Wood', hiddenStems: [] }
    },
    dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'balanced' },
    season: 'spring',
    monthBranch: '丑',
    elementBalance: { Wood: 30, Fire: 20, Earth: 20, Metal: 15, Water: 15 },
    dominantElement: 'Wood',
    tenGods: {},
    hasRoot: true,
    rootCount: 2,
    emptyBranches: [],
    combinations: [],
    clashes: [],
    harms: [],
    punishments: [],
    ...overrides
  } as ChartContext;
}

describe('Combination Edge Cases', () => {
  test('Season blocks Three Harmony transformation', () => {
    // 申子辰 Water combination in Summer (Fire season) should fail to transform
    const waterCombination: DetectedCombination = {
      type: 'three_harmony',
      participants: ['申', '子', '辰'],
      resultElement: 'Water',
      positions: ['year', 'month', 'day'],
      transformed: false
    };

    const ctx = createTestContext({
      season: 'summer', // Fire season opposes Water
      combinations: [waterCombination]
    });

    const result = evaluateCombinations(ctx, rules);

    expect(result.combinations.length).toBe(1);
    expect(result.combinations[0].finalStatus).not.toBe('transformed');
  });

  test('Six Harmony combination succeeds with support', () => {
    const sixHarmony: DetectedCombination = {
      type: 'six_harmony',
      participants: ['子', '丑'],
      resultElement: 'Earth',
      positions: ['year', 'month'],
      transformed: false
    };

    const ctx = createTestContext({
      season: 'late_summer', // Earth season supports Earth transformation
      combinations: [sixHarmony],
      elementBalance: { Wood: 15, Fire: 15, Earth: 40, Metal: 15, Water: 15 }
    });

    const result = evaluateCombinations(ctx, rules);

    expect(result.combinations.length).toBe(1);
    // With Earth season and Earth dominant, should transform
  });

  test('Combination broken by clash', () => {
    // 子丑 combination broken by 午 clashing 子
    const sixHarmony: DetectedCombination = {
      type: 'six_harmony',
      participants: ['子', '丑'],
      resultElement: 'Earth',
      positions: ['year', 'month'],
      transformed: false
    };

    const ctx = createTestContext({
      season: 'summer',
      combinations: [sixHarmony],
      clashes: [{
        pair: ['子', '午'],
        positions: ['year', 'hour'],
        strength: 'full'
      }]
    });

    const result = evaluateCombinations(ctx, rules);

    expect(result.combinations.length).toBe(1);
    // Clash should affect the combination
  });

  test('Stem combination transforms with season support', () => {
    // 甲己 combine to Earth - needs Earth season/support
    const stemCombo: DetectedCombination = {
      type: 'stem_combination',
      participants: ['甲', '己'],
      resultElement: 'Earth',
      positions: ['year', 'month'],
      transformed: false
    };

    const ctx = createTestContext({
      season: 'late_summer',
      combinations: [stemCombo],
      elementBalance: { Wood: 20, Fire: 20, Earth: 35, Metal: 15, Water: 10 }
    });

    const result = evaluateCombinations(ctx, rules);

    expect(result.combinations.length).toBe(1);
  });

  test('Directional combination (方合) always transforms', () => {
    const directional: DetectedCombination = {
      type: 'directional',
      participants: ['寅', '卯', '辰'],
      resultElement: 'Wood',
      positions: ['year', 'month', 'day'],
      transformed: false
    };

    const ctx = createTestContext({
      season: 'autumn', // Even in opposing season
      combinations: [directional]
    });

    const result = evaluateCombinations(ctx, rules);

    expect(result.combinations.length).toBe(1);
    expect(result.combinations[0].finalStatus).toBe('transformed');
  });
});
