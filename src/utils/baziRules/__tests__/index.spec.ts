/**
 * Integration Tests - Main Entry Point
 * Tests for the complete evaluateClassicalEdgeCases function
 */

import {
  evaluateClassicalEdgeCases,
  evaluateQuickSummary,
  generateEdgeCaseReport,
  ChartContext
} from '../index';

// Helper to create a complete chart context for integration testing
function createCompleteChartContext(): ChartContext {
  return {
    pillars: {
      year: {
        stem: '甲',
        branch: '寅',
        stemElement: 'Wood',
        branchElement: 'Wood',
        hiddenStems: [
          { stem: '甲', element: 'Wood', percentage: 60, type: 'main_qi' },
          { stem: '丙', element: 'Fire', percentage: 30, type: 'zhong_qi' },
          { stem: '戊', element: 'Earth', percentage: 10, type: 'yu_qi' }
        ]
      },
      month: {
        stem: '丙',
        branch: '午',
        stemElement: 'Fire',
        branchElement: 'Fire',
        hiddenStems: [
          { stem: '丁', element: 'Fire', percentage: 70, type: 'main_qi' },
          { stem: '己', element: 'Earth', percentage: 30, type: 'zhong_qi' }
        ]
      },
      day: {
        stem: '戊',
        branch: '戌',
        stemElement: 'Earth',
        branchElement: 'Earth',
        hiddenStems: [
          { stem: '戊', element: 'Earth', percentage: 60, type: 'main_qi' },
          { stem: '辛', element: 'Metal', percentage: 25, type: 'zhong_qi' },
          { stem: '丁', element: 'Fire', percentage: 15, type: 'yu_qi' }
        ]
      },
      hour: {
        stem: '庚',
        branch: '申',
        stemElement: 'Metal',
        branchElement: 'Metal',
        hiddenStems: [
          { stem: '庚', element: 'Metal', percentage: 60, type: 'main_qi' },
          { stem: '壬', element: 'Water', percentage: 25, type: 'zhong_qi' },
          { stem: '戊', element: 'Earth', percentage: 15, type: 'yu_qi' }
        ]
      }
    },
    dayMaster: {
      stem: '戊',
      element: 'Earth',
      polarity: 'Yang',
      strength: 'strong'
    },
    season: 'summer',
    monthBranch: '午',
    elementBalance: {
      Wood: 15,
      Fire: 30,
      Earth: 30,
      Metal: 15,
      Water: 10
    },
    dominantElement: 'Fire',
    tenGods: {},
    hasRoot: true,
    rootCount: 3,
    emptyBranches: [],
    combinations: [],
    clashes: [],
    harms: [],
    punishments: [],
    usefulGod: {
      element: 'Water',
      position: 'hour',
      strength: 60
    }
  };
}

describe('Classical Edge Cases Integration', () => {
  test('evaluateClassicalEdgeCases returns complete result', () => {
    const ctx = createCompleteChartContext();
    const result = evaluateClassicalEdgeCases(ctx);

    // Should have all evaluation categories
    expect(result.structures).toBeDefined();
    expect(result.combinations).toBeDefined();
    expect(result.usefulGod).toBeDefined();
    expect(result.clashHarmPunishment).toBeDefined();
    expect(result.seasonal).toBeDefined();
    expect(result.hiddenStems).toBeDefined();

    // Luck pillar should be undefined when not provided
    expect(result.luckPillar).toBeUndefined();
  });

  test('evaluateClassicalEdgeCases with luck pillar', () => {
    const ctx = createCompleteChartContext();
    ctx.currentLuckPillar = {
      stem: '壬',
      branch: '子',
      stemElement: 'Water',
      branchElement: 'Water',
      hiddenStems: [{ stem: '癸', element: 'Water', percentage: 100, type: 'main_qi' }]
    };

    const result = evaluateClassicalEdgeCases(ctx);

    expect(result.luckPillar).toBeDefined();
    expect(result.luckPillar?.periodQuality).toBeDefined();
  });

  test('evaluateQuickSummary returns concise results', () => {
    const ctx = createCompleteChartContext();
    const summary = evaluateQuickSummary(ctx);

    expect(typeof summary.hasSpecialStructure).toBe('boolean');
    expect(typeof summary.structureType).toBe('string');
    expect(typeof summary.usefulGodStatus).toBe('string');
    expect(typeof summary.interactionIntensity).toBe('string');
    expect(Array.isArray(summary.warnings)).toBe(true);
  });

  test('generateEdgeCaseReport returns readable string', () => {
    const ctx = createCompleteChartContext();
    const report = generateEdgeCaseReport(ctx);

    expect(typeof report).toBe('string');
    expect(report.length).toBeGreaterThan(100);

    // Should contain section headers
    expect(report).toContain('STRUCTURE ANALYSIS');
    expect(report).toContain('USEFUL GOD ANALYSIS');
    expect(report).toContain('COMBINATION ANALYSIS');
    expect(report).toContain('CLASH/HARM/PUNISHMENT');
    expect(report).toContain('SEASONAL MODIFIERS');
    expect(report).toContain('HIDDEN STEMS');
  });

  test('Canonical chart: Strong Earth DM in Summer', () => {
    const ctx = createCompleteChartContext();
    const result = evaluateClassicalEdgeCases(ctx);

    // Strong Earth in Summer (Fire produces Earth) should be normal structure
    expect(result.structures.determinedStructure).toBe('normal');

    // Fire season should boost Fire element
    expect(result.seasonal.elementModifiers.Fire).toBeGreaterThanOrEqual(1.0);
  });

  test('Canonical chart: Weak Water DM in Autumn with Metal support', () => {
    const ctx: ChartContext = {
      ...createCompleteChartContext(),
      dayMaster: {
        stem: '癸',
        element: 'Water',
        polarity: 'Yin',
        strength: 'weak'
      },
      season: 'autumn',
      monthBranch: '酉',
      elementBalance: {
        Wood: 10,
        Fire: 10,
        Earth: 20,
        Metal: 40,
        Water: 20
      },
      dominantElement: 'Metal'
    };

    const result = evaluateClassicalEdgeCases(ctx);

    // Metal produces Water, so Water is supported in Autumn
    expect(result.seasonal.elementModifiers.Metal).toBeGreaterThanOrEqual(1.0);
  });

  test('Chart with multiple clashes', () => {
    const ctx: ChartContext = {
      ...createCompleteChartContext(),
      clashes: [
        { pair: ['子', '午'], positions: ['year', 'month'], strength: 'full' },
        { pair: ['卯', '酉'], positions: ['day', 'hour'], strength: 'full' }
      ]
    };

    const result = evaluateClassicalEdgeCases(ctx);

    expect(result.clashHarmPunishment.clashes.length).toBe(2);
  });

  test('Chart with Three Harmony combination', () => {
    const ctx: ChartContext = {
      ...createCompleteChartContext(),
      combinations: [{
        type: 'three_harmony',
        participants: ['寅', '午', '戌'],
        resultElement: 'Fire',
        positions: ['year', 'month', 'day'],
        transformed: false
      }]
    };

    const result = evaluateClassicalEdgeCases(ctx);

    expect(result.combinations.combinations.length).toBe(1);
    // In Summer (Fire season), Fire三合 should transform
    expect(result.combinations.combinations[0].finalStatus).toBe('transformed');
  });

  test('Performance: evaluation completes in reasonable time', () => {
    const ctx = createCompleteChartContext();

    const startTime = performance.now();
    for (let i = 0; i < 100; i++) {
      evaluateClassicalEdgeCases(ctx);
    }
    const endTime = performance.now();

    const avgTime = (endTime - startTime) / 100;

    // Should complete in under 50ms per evaluation
    expect(avgTime).toBeLessThan(50);
  });
});
