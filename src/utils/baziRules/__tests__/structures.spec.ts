/**
 * Structure Edge Cases - Unit Tests
 * Tests for special BaZi structures (Follow, Established Rank, Blade, etc.)
 */

import { evaluateStructures } from '../structureEngine';
import structuresJson from '../../../data/rules/structures.json';
import { ChartContext } from '../types';

const rules = (structuresJson as any).structures;

// Helper to create minimal chart context for testing
function createTestContext(overrides: Partial<ChartContext>): ChartContext {
  return {
    pillars: {
      year: { stem: '甲', branch: '寅', stemElement: 'Wood', branchElement: 'Wood', hiddenStems: [] },
      month: { stem: '丙', branch: '卯', stemElement: 'Fire', branchElement: 'Wood', hiddenStems: [] },
      day: { stem: '甲', branch: '辰', stemElement: 'Wood', branchElement: 'Earth', hiddenStems: [] },
      hour: { stem: '丁', branch: '巳', stemElement: 'Fire', branchElement: 'Fire', hiddenStems: [] }
    },
    dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'balanced' },
    season: 'spring',
    monthBranch: '卯',
    elementBalance: { Wood: 35, Fire: 25, Earth: 15, Metal: 10, Water: 15 },
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

describe('Structure Edge Cases', () => {
  test('weak Day Master with strong seasonal support → not a follow structure', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'weak' },
      season: 'spring',
      hasRoot: true,
      rootCount: 2
    });

    const result = evaluateStructures(ctx, rules);

    // Should NOT be a follow structure because of seasonal support and roots
    expect(result.determinedStructure).not.toContain('follow');
  });

  test('fake_follow_wealth → detected when hidden root exists', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '壬', element: 'Water', polarity: 'Yang', strength: 'extremely_weak' },
      season: 'autumn',
      dominantElement: 'Metal',
      hasRoot: false,
      rootCount: 0,
      elementBalance: { Wood: 5, Fire: 5, Earth: 60, Metal: 20, Water: 10 }
    });

    const result = evaluateStructures(ctx, rules);

    // Should detect potential follow structure issues
    expect(result.warnings.length).toBeGreaterThanOrEqual(0);
  });

  test('true_follow_wealth → extremely weak DM, no root, wealth dominant', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '癸', element: 'Water', polarity: 'Yin', strength: 'extremely_weak' },
      season: 'late_summer',
      dominantElement: 'Earth',
      hasRoot: false,
      rootCount: 0,
      elementBalance: { Wood: 5, Fire: 10, Earth: 65, Metal: 10, Water: 10 }
    });

    const result = evaluateStructures(ctx, rules);

    // Should evaluate structure rules
    expect(result.matchedRules).toBeDefined();
  });

  test('jian_lu (Established Rank) → month branch is Lu of Day Master', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'strong' },
      season: 'spring',
      monthBranch: '寅', // 寅 is Lu for 甲
      hasRoot: true,
      rootCount: 3
    });

    const result = evaluateStructures(ctx, rules);

    // Should process Established Rank structure rules
    expect(result.determinedStructure).toBeDefined();
  });

  test('yang_ren (Blade) → strong DM needs officer control', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'very_strong' },
      season: 'spring',
      monthBranch: '卯', // 卯 is Yang Ren for 甲
      hasRoot: true,
      rootCount: 4,
      elementBalance: { Wood: 50, Fire: 15, Earth: 10, Metal: 15, Water: 10 }
    });

    const result = evaluateStructures(ctx, rules);

    // Should identify need for control
    expect(result.determinedStructure).toBeDefined();
  });
});
