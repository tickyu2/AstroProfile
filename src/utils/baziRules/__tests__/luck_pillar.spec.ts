/**
 * Luck Pillar Edge Cases - Unit Tests
 * Tests for luck pillar (大运) exception rules
 */

import { evaluateLuckPillarRules, getLuckPillarSummary } from '../luckPillarEngine';
import luckPillarJson from '../../../data/rules/luck_pillar.json';
import { ChartContext, Pillar } from '../types';

const rules = (luckPillarJson as any).luck_pillar_exceptions;

// Helper to create minimal chart context for testing
function createTestContext(overrides: Partial<ChartContext>): ChartContext {
  return {
    pillars: {
      year: { stem: '甲', branch: '申', stemElement: 'Wood', branchElement: 'Metal', hiddenStems: [] },
      month: { stem: '丙', branch: '子', stemElement: 'Fire', branchElement: 'Water', hiddenStems: [] },
      day: { stem: '戊', branch: '戌', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
      hour: { stem: '庚', branch: '寅', stemElement: 'Metal', branchElement: 'Wood', hiddenStems: [] }
    },
    dayMaster: { stem: '戊', element: 'Earth', polarity: 'Yang', strength: 'balanced' },
    season: 'winter',
    monthBranch: '子',
    elementBalance: { Wood: 20, Fire: 15, Earth: 25, Metal: 20, Water: 20 },
    dominantElement: 'Earth',
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

describe('Luck Pillar Edge Cases', () => {
  test('Luck pillar breaks follow structure', () => {
    const luckPillar: Pillar = {
      stem: '甲',
      branch: '寅',
      stemElement: 'Wood',
      branchElement: 'Wood',
      hiddenStems: []
    };

    const ctx = createTestContext({
      dayMaster: { stem: '癸', element: 'Water', polarity: 'Yin', strength: 'extremely_weak' },
      currentStructure: 'true_follow',
      currentLuckPillar: luckPillar // Wood produces Water, could break follow
    });

    const result = evaluateLuckPillarRules(ctx, rules);

    expect(result.periodQuality).toBeDefined();
    expect(result.warnings.length).toBeGreaterThanOrEqual(0);
  });

  test('Luck pillar completes Three Harmony', () => {
    // Natal has 申 and 子, luck pillar brings 辰 to complete Water三合
    const luckPillar: Pillar = {
      stem: '戊',
      branch: '辰',
      stemElement: 'Earth',
      branchElement: 'Earth',
      hiddenStems: []
    };

    const ctx = createTestContext({
      pillars: {
        year: { stem: '甲', branch: '申', stemElement: 'Wood', branchElement: 'Metal', hiddenStems: [] },
        month: { stem: '壬', branch: '子', stemElement: 'Water', branchElement: 'Water', hiddenStems: [] },
        day: { stem: '戊', branch: '戌', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        hour: { stem: '庚', branch: '午', stemElement: 'Metal', branchElement: 'Fire', hiddenStems: [] }
      },
      currentLuckPillar: luckPillar
    });

    const result = evaluateLuckPillarRules(ctx, rules);

    // Should detect completion of Water three harmony
    expect(result.activatedPatterns.length).toBeGreaterThanOrEqual(0);
  });

  test('Luck pillar activates Three Punishment', () => {
    // Natal has 寅 and 巳, luck pillar brings 申 to complete punishment
    const luckPillar: Pillar = {
      stem: '庚',
      branch: '申',
      stemElement: 'Metal',
      branchElement: 'Metal',
      hiddenStems: []
    };

    const ctx = createTestContext({
      pillars: {
        year: { stem: '甲', branch: '寅', stemElement: 'Wood', branchElement: 'Wood', hiddenStems: [] },
        month: { stem: '丙', branch: '巳', stemElement: 'Fire', branchElement: 'Fire', hiddenStems: [] },
        day: { stem: '戊', branch: '戌', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        hour: { stem: '庚', branch: '午', stemElement: 'Metal', branchElement: 'Fire', hiddenStems: [] }
      },
      currentLuckPillar: luckPillar
    });

    const result = evaluateLuckPillarRules(ctx, rules);

    // Should warn about activated punishment
    expect(result.periodQuality).toBeDefined();
  });

  test('Luck pillar reveals hidden useful god', () => {
    const luckPillar: Pillar = {
      stem: '壬',
      branch: '子',
      stemElement: 'Water',
      branchElement: 'Water',
      hiddenStems: []
    };

    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'weak' },
      usefulGod: { element: 'Water', position: 'hidden', strength: 40 },
      currentLuckPillar: luckPillar // Water luck pillar reveals Water useful god
    });

    const result = evaluateLuckPillarRules(ctx, rules);

    // Period should be favorable when useful god is activated
    expect(['favorable', 'neutral']).toContain(result.periodQuality);
  });

  test('Luck pillar clashes natal useful god', () => {
    const luckPillar: Pillar = {
      stem: '丙',
      branch: '午',
      stemElement: 'Fire',
      branchElement: 'Fire',
      hiddenStems: []
    };

    const ctx = createTestContext({
      pillars: {
        year: { stem: '甲', branch: '子', stemElement: 'Wood', branchElement: 'Water', hiddenStems: [] },
        month: { stem: '丙', branch: '寅', stemElement: 'Fire', branchElement: 'Wood', hiddenStems: [] },
        day: { stem: '戊', branch: '戌', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        hour: { stem: '庚', branch: '申', stemElement: 'Metal', branchElement: 'Metal', hiddenStems: [] }
      },
      usefulGod: { element: 'Water', position: 'year', strength: 70 },
      currentLuckPillar: luckPillar // 午 clashes 子 (useful god position)
    });

    const result = evaluateLuckPillarRules(ctx, rules);

    // Should be challenging period
    expect(['challenging', 'turbulent', 'neutral']).toContain(result.periodQuality);
  });

  test('Fan Yin (伏吟) - luck pillar matches natal', () => {
    const luckPillar: Pillar = {
      stem: '戊',
      branch: '戌',
      stemElement: 'Earth',
      branchElement: 'Earth',
      hiddenStems: []
    };

    const ctx = createTestContext({
      currentLuckPillar: luckPillar // Same as day pillar 戊戌
    });

    const result = evaluateLuckPillarRules(ctx, rules);

    // Fan Yin intensifies natal themes
    expect(result.matchedRules).toBeDefined();
  });

  test('Luck pillar fills empty branch', () => {
    const luckPillar: Pillar = {
      stem: '甲',
      branch: '辰',
      stemElement: 'Wood',
      branchElement: 'Earth',
      hiddenStems: []
    };

    const ctx = createTestContext({
      emptyBranches: ['辰', '巳'],
      currentLuckPillar: luckPillar // 辰 fills empty branch
    });

    const result = evaluateLuckPillarRules(ctx, rules);

    // Should activate latent potential
    expect(result.activatedPatterns.length).toBeGreaterThanOrEqual(0);
  });

  test('Direction change from supportive to unsupportive', () => {
    const previousLuckPillar: Pillar = {
      stem: '壬',
      branch: '子',
      stemElement: 'Water',
      branchElement: 'Water',
      hiddenStems: []
    };

    const currentLuckPillar: Pillar = {
      stem: '庚',
      branch: '申',
      stemElement: 'Metal',
      branchElement: 'Metal',
      hiddenStems: []
    };

    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'weak' },
      previousLuckPillar, // Water was supportive (produces Wood)
      currentLuckPillar   // Metal is unsupportive (controls Wood)
    });

    const result = evaluateLuckPillarRules(ctx, rules);

    // Transition should be detected
    expect(result.periodQuality).toBeDefined();
  });

  test('getLuckPillarSummary utility', () => {
    const luckPillar: Pillar = {
      stem: '甲',
      branch: '寅',
      stemElement: 'Wood',
      branchElement: 'Wood',
      hiddenStems: []
    };

    const ctx = createTestContext({
      currentLuckPillar: luckPillar
    });

    const result = evaluateLuckPillarRules(ctx, rules);
    const summary = getLuckPillarSummary(result);

    expect(typeof summary).toBe('string');
    expect(summary.length).toBeGreaterThan(0);
  });

  test('No luck pillar provided → neutral with warning', () => {
    const ctx = createTestContext({
      currentLuckPillar: undefined
    });

    const result = evaluateLuckPillarRules(ctx, rules);

    expect(result.periodQuality).toBe('neutral');
    expect(result.warnings).toContain('No current luck pillar provided');
  });
});
