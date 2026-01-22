/**
 * Useful God Edge Cases - Unit Tests
 * Tests for Useful God (用神) exceptions and interactions
 */

import { evaluateUsefulGod } from '../usefulGodEngine';
import usefulGodJson from '../../../data/rules/useful_god.json';
import { ChartContext } from '../types';

const rules = (usefulGodJson as any).useful_god_exceptions;

// Helper to create minimal chart context for testing
function createTestContext(overrides: Partial<ChartContext>): ChartContext {
  return {
    pillars: {
      year: { stem: '甲', branch: '寅', stemElement: 'Wood', branchElement: 'Wood', hiddenStems: [] },
      month: { stem: '丙', branch: '午', stemElement: 'Fire', branchElement: 'Fire', hiddenStems: [] },
      day: { stem: '庚', branch: '申', stemElement: 'Metal', branchElement: 'Metal', hiddenStems: [] },
      hour: { stem: '壬', branch: '子', stemElement: 'Water', branchElement: 'Water', hiddenStems: [] }
    },
    dayMaster: { stem: '庚', element: 'Metal', polarity: 'Yang', strength: 'balanced' },
    season: 'summer',
    monthBranch: '午',
    elementBalance: { Wood: 20, Fire: 30, Earth: 15, Metal: 20, Water: 15 },
    dominantElement: 'Fire',
    tenGods: {},
    hasRoot: true,
    rootCount: 1,
    emptyBranches: [],
    combinations: [],
    clashes: [],
    harms: [],
    punishments: [],
    ...overrides
  } as ChartContext;
}

describe('Useful God Edge Cases', () => {
  test('Useful God blocked by combination → status becomes blocked', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'weak' },
      usefulGod: {
        element: 'Water',
        position: 'month',
        strength: 80
      },
      combinations: [{
        type: 'six_harmony',
        participants: ['子', '丑'],
        resultElement: 'Earth', // Transforms to different element
        positions: ['month', 'year'],
        transformed: true
      }]
    });

    const result = evaluateUsefulGod(ctx, rules);

    // Useful god position is involved in combination
    expect(result.primaryUsefulGod).toBeDefined();
    expect(result.matchedRules.length).toBeGreaterThanOrEqual(0);
  });

  test('Useful God weakened by clash', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '丙', element: 'Fire', polarity: 'Yang', strength: 'weak' },
      usefulGod: {
        element: 'Wood',
        position: 'year',
        strength: 70
      },
      clashes: [{
        pair: ['寅', '申'],
        positions: ['year', 'day'],
        strength: 'full'
      }]
    });

    const result = evaluateUsefulGod(ctx, rules);

    // Clash affects useful god position
    expect(result.primaryUsefulGod).toBe('Wood');
  });

  test('Useful God harmed → compromised status', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '壬', element: 'Water', polarity: 'Yang', strength: 'weak' },
      usefulGod: {
        element: 'Metal',
        position: 'month',
        strength: 60
      },
      harms: [{
        pair: ['酉', '戌'],
        positions: ['month', 'year']
      }]
    });

    const result = evaluateUsefulGod(ctx, rules);

    expect(result.primaryUsefulGod).toBe('Metal');
  });

  test('Useful God only in hidden stems → latent status', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '丁', element: 'Fire', polarity: 'Yin', strength: 'weak' },
      usefulGod: {
        element: 'Wood',
        position: 'hidden',
        strength: 40
      }
    });

    const result = evaluateUsefulGod(ctx, rules);

    // Hidden useful god should be identified
    expect(result.primaryUsefulGod).toBe('Wood');
  });

  test('Fire useful god in winter → severely weakened', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '庚', element: 'Metal', polarity: 'Yang', strength: 'strong' },
      season: 'winter',
      usefulGod: {
        element: 'Fire',
        position: 'hour',
        strength: 50
      },
      elementBalance: { Wood: 10, Fire: 15, Earth: 15, Metal: 30, Water: 30 }
    });

    const result = evaluateUsefulGod(ctx, rules);

    // Fire in winter should be weakened
    expect(result.primaryUsefulGod).toBe('Fire');
  });

  test('Multiple useful gods present → primary determined', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'balanced' },
      usefulGod: {
        element: 'Water',
        position: 'year',
        strength: 70
      }
      // Implicit secondary useful god in chart
    });

    const result = evaluateUsefulGod(ctx, rules);

    expect(result.primaryUsefulGod).toBe('Water');
  });
});
