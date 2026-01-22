/**
 * Seasonal Overrides - Unit Tests
 * Tests for seasonal strength modifiers
 */

import { evaluateSeasonalOverrides, getSeasonalStrengthDescription } from '../seasonalEngine';
import seasonalJson from '../../../data/rules/seasonal.json';
import { ChartContext } from '../types';

const rules = (seasonalJson as any).seasonal_exceptions;

// Helper to create minimal chart context for testing
function createTestContext(overrides: Partial<ChartContext>): ChartContext {
  return {
    pillars: {
      year: { stem: '丙', branch: '午', stemElement: 'Fire', branchElement: 'Fire', hiddenStems: [] },
      month: { stem: '丁', branch: '未', stemElement: 'Fire', branchElement: 'Earth', hiddenStems: [] },
      day: { stem: '丙', branch: '寅', stemElement: 'Fire', branchElement: 'Wood', hiddenStems: [] },
      hour: { stem: '甲', branch: '午', stemElement: 'Wood', branchElement: 'Fire', hiddenStems: [] }
    },
    dayMaster: { stem: '丙', element: 'Fire', polarity: 'Yang', strength: 'balanced' },
    season: 'summer',
    monthBranch: '午',
    elementBalance: { Wood: 20, Fire: 40, Earth: 15, Metal: 10, Water: 15 },
    dominantElement: 'Fire',
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

describe('Seasonal Overrides', () => {
  test('Fire extremely weak in winter (子月)', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '丙', element: 'Fire', polarity: 'Yang', strength: 'balanced' },
      season: 'winter',
      monthBranch: '子',
      elementBalance: { Wood: 10, Fire: 15, Earth: 15, Metal: 20, Water: 40 }
    });

    const result = evaluateSeasonalOverrides(ctx, rules);

    // Fire should have reduced modifier in winter
    expect(result.elementModifiers.Fire).toBeLessThan(1.0);
  });

  test('Water weakened in summer (午月)', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '壬', element: 'Water', polarity: 'Yang', strength: 'balanced' },
      season: 'summer',
      monthBranch: '午',
      elementBalance: { Wood: 15, Fire: 40, Earth: 20, Metal: 10, Water: 15 }
    });

    const result = evaluateSeasonalOverrides(ctx, rules);

    // Water should be weakened in summer
    expect(result.elementModifiers.Water).toBeLessThan(1.0);
  });

  test('Wood cut in autumn (酉月)', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'balanced' },
      season: 'autumn',
      monthBranch: '酉',
      elementBalance: { Wood: 15, Fire: 15, Earth: 15, Metal: 40, Water: 15 }
    });

    const result = evaluateSeasonalOverrides(ctx, rules);

    // Wood should be weak in autumn (Metal season)
    expect(result.elementModifiers.Wood).toBeLessThan(1.0);
  });

  test('Metal melted in summer fire', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '庚', element: 'Metal', polarity: 'Yang', strength: 'balanced' },
      season: 'summer',
      monthBranch: '午',
      elementBalance: { Wood: 10, Fire: 45, Earth: 15, Metal: 20, Water: 10 }
    });

    const result = evaluateSeasonalOverrides(ctx, rules);

    // Metal should be weakened by summer fire
    expect(result.elementModifiers.Metal).toBeLessThan(1.0);
  });

  test('Element at peak in its season (Wang phase)', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'strong' },
      season: 'spring',
      monthBranch: '卯'
    });

    const result = evaluateSeasonalOverrides(ctx, rules);

    // Wood should be strong in spring
    expect(result.elementModifiers.Wood).toBeGreaterThanOrEqual(1.0);
  });

  test('Earth strong in transition months (辰未戌丑)', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '戊', element: 'Earth', polarity: 'Yang', strength: 'balanced' },
      season: 'late_summer',
      monthBranch: '未'
    });

    const result = evaluateSeasonalOverrides(ctx, rules);

    // Earth should be boosted in Earth months
    expect(result.elementModifiers.Earth).toBeGreaterThanOrEqual(1.0);
  });

  test('Support needed recommendations', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '丙', element: 'Fire', polarity: 'Yang', strength: 'weak' },
      season: 'winter',
      monthBranch: '子',
      elementBalance: { Wood: 5, Fire: 10, Earth: 15, Metal: 25, Water: 45 }
    });

    const result = evaluateSeasonalOverrides(ctx, rules);

    // Fire in winter needs Wood support
    expect(result.supportNeeded).toBeDefined();
  });

  test('getSeasonalStrengthDescription utility', () => {
    const fireInWinter = getSeasonalStrengthDescription('Fire', 'winter');
    expect(fireInWinter.modifier).toBeLessThan(1.0);

    const woodInSpring = getSeasonalStrengthDescription('Wood', 'spring');
    expect(woodInSpring.phase).toBe('wang (旺)');
    expect(woodInSpring.modifier).toBeGreaterThan(1.0);
  });
});
