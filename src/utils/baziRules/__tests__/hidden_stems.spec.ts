/**
 * Hidden Stem Edge Cases - Unit Tests
 * Tests for hidden stem (藏干) exceptions
 */

import { evaluateHiddenStems, getTotalHiddenElementStrength, findUsefulGodInHiddenStems } from '../hiddenStemEngine';
import hiddenJson from '../../../data/rules/hidden_stems.json';
import { ChartContext, HiddenStem } from '../types';

const rules = (hiddenJson as any).hidden_stem_exceptions;

// Helper to create minimal chart context for testing
function createTestContext(overrides: Partial<ChartContext>): ChartContext {
  const defaultHiddenStems: HiddenStem[] = [
    { stem: '甲', element: 'Wood', percentage: 60, type: 'main_qi' },
    { stem: '丙', element: 'Fire', percentage: 30, type: 'zhong_qi' },
    { stem: '戊', element: 'Earth', percentage: 10, type: 'yu_qi' }
  ];

  return {
    pillars: {
      year: { stem: '甲', branch: '寅', stemElement: 'Wood', branchElement: 'Wood', hiddenStems: defaultHiddenStems },
      month: { stem: '丙', branch: '午', stemElement: 'Fire', branchElement: 'Fire', hiddenStems: [{ stem: '丁', element: 'Fire', percentage: 70, type: 'main_qi' }, { stem: '己', element: 'Earth', percentage: 30, type: 'zhong_qi' }] },
      day: { stem: '戊', branch: '戌', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [{ stem: '戊', element: 'Earth', percentage: 60, type: 'main_qi' }, { stem: '辛', element: 'Metal', percentage: 25, type: 'zhong_qi' }, { stem: '丁', element: 'Fire', percentage: 15, type: 'yu_qi' }] },
      hour: { stem: '庚', branch: '申', stemElement: 'Metal', branchElement: 'Metal', hiddenStems: [{ stem: '庚', element: 'Metal', percentage: 60, type: 'main_qi' }, { stem: '壬', element: 'Water', percentage: 25, type: 'zhong_qi' }, { stem: '戊', element: 'Earth', percentage: 15, type: 'yu_qi' }] }
    },
    dayMaster: { stem: '戊', element: 'Earth', polarity: 'Yang', strength: 'balanced' },
    season: 'summer',
    monthBranch: '午',
    elementBalance: { Wood: 20, Fire: 25, Earth: 25, Metal: 20, Water: 10 },
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

describe('Hidden Stem Edge Cases', () => {
  test('Hidden stem revealed in Heavenly Stems → fully activated', () => {
    // 甲 is in year stem AND hidden in year branch
    const ctx = createTestContext({
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
        month: { stem: '丙', branch: '午', stemElement: 'Fire', branchElement: 'Fire', hiddenStems: [] },
        day: { stem: '戊', branch: '戌', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        hour: { stem: '庚', branch: '申', stemElement: 'Metal', branchElement: 'Metal', hiddenStems: [] }
      }
    });

    const result = evaluateHiddenStems(ctx, rules);

    // Find the 甲 hidden stem in year pillar
    const jiaHidden = result.stems.find(s => s.pillar === 'year' && s.stem.stem === '甲');
    expect(jiaHidden).toBeDefined();
    expect(jiaHidden?.status).toBe('active');
    expect(jiaHidden?.effectiveStrength).toBeGreaterThan(60); // Boosted because revealed
  });

  test('Hidden stem in clashed branch → disrupted', () => {
    const ctx = createTestContext({
      clashes: [{
        pair: ['寅', '申'],
        positions: ['year', 'hour'],
        strength: 'full'
      }]
    });

    const result = evaluateHiddenStems(ctx, rules);

    // Hidden stems in year (寅) should be disrupted
    const yearStems = result.stems.filter(s => s.pillar === 'year');
    yearStems.forEach(stem => {
      expect(stem.status).toBe('disrupted');
      expect(stem.effectiveStrength).toBeLessThan(stem.stem.percentage);
    });
  });

  test('Hidden stem in combined branch → may transform', () => {
    const ctx = createTestContext({
      combinations: [{
        type: 'six_harmony',
        participants: ['寅', '亥'],
        resultElement: 'Wood',
        positions: ['year', 'hour'],
        transformed: true
      }]
    });

    const result = evaluateHiddenStems(ctx, rules);

    // Hidden stems in year branch should be affected
    const yearStems = result.stems.filter(s => s.pillar === 'year');
    expect(yearStems.length).toBeGreaterThan(0);
  });

  test('Main Qi (本气) has dominant influence', () => {
    const ctx = createTestContext({});

    const result = evaluateHiddenStems(ctx, rules);

    // Main qi stems should have higher effective strength
    const mainQiStems = result.stems.filter(s => s.stem.type === 'main_qi');
    mainQiStems.forEach(stem => {
      expect(stem.effectiveStrength).toBeGreaterThanOrEqual(stem.stem.percentage * 0.5);
    });
  });

  test('Residual Qi (余气) has minor influence', () => {
    const ctx = createTestContext({});

    const result = evaluateHiddenStems(ctx, rules);

    // Yu qi stems have lower base percentage
    const yuQiStems = result.stems.filter(s => s.stem.type === 'yu_qi');
    yuQiStems.forEach(stem => {
      expect(stem.stem.percentage).toBeLessThanOrEqual(20);
    });
  });

  test('Hidden stem in empty branch → dormant', () => {
    const ctx = createTestContext({
      emptyBranches: ['寅'] // Year branch is empty
    });

    const result = evaluateHiddenStems(ctx, rules);

    // Hidden stems in empty branch should be dormant
    const yearStems = result.stems.filter(s => s.pillar === 'year');
    yearStems.forEach(stem => {
      expect(stem.status).toBe('dormant');
    });
  });

  test('getTotalHiddenElementStrength utility', () => {
    const ctx = createTestContext({});
    const result = evaluateHiddenStems(ctx, rules);

    const totals = getTotalHiddenElementStrength(result);

    // Should have totals for all elements
    expect(totals.Wood).toBeGreaterThanOrEqual(0);
    expect(totals.Fire).toBeGreaterThanOrEqual(0);
    expect(totals.Earth).toBeGreaterThanOrEqual(0);
    expect(totals.Metal).toBeGreaterThanOrEqual(0);
    expect(totals.Water).toBeGreaterThanOrEqual(0);
  });

  test('findUsefulGodInHiddenStems utility', () => {
    const ctx = createTestContext({});
    const result = evaluateHiddenStems(ctx, rules);

    const woodSearch = findUsefulGodInHiddenStems(result, 'Wood');

    expect(woodSearch.found).toBe(true);
    expect(woodSearch.positions.length).toBeGreaterThan(0);
    expect(woodSearch.totalStrength).toBeGreaterThan(0);
  });

  test('Hidden stem breaks follow structure candidate', () => {
    // Very weak day master trying to follow, but hidden stem provides support
    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'extremely_weak' },
      season: 'autumn',
      pillars: {
        year: { stem: '庚', branch: '申', stemElement: 'Metal', branchElement: 'Metal',
          hiddenStems: [
            { stem: '庚', element: 'Metal', percentage: 60, type: 'main_qi' },
            { stem: '壬', element: 'Water', percentage: 25, type: 'zhong_qi' }, // Water produces Wood!
            { stem: '戊', element: 'Earth', percentage: 15, type: 'yu_qi' }
          ]
        },
        month: { stem: '辛', branch: '酉', stemElement: 'Metal', branchElement: 'Metal', hiddenStems: [{ stem: '辛', element: 'Metal', percentage: 100, type: 'main_qi' }] },
        day: { stem: '甲', branch: '戌', stemElement: 'Wood', branchElement: 'Earth', hiddenStems: [] },
        hour: { stem: '庚', branch: '申', stemElement: 'Metal', branchElement: 'Metal', hiddenStems: [] }
      },
      hasRoot: false,
      rootCount: 0,
      currentStructure: 'fake_follow'
    });

    const result = evaluateHiddenStems(ctx, rules);

    // Should find Water in hidden stems that could support Wood day master
    const waterSearch = findUsefulGodInHiddenStems(result, 'Water');
    expect(waterSearch.found).toBe(true);
  });
});
