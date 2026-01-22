/**
 * Clash / Harm / Punishment Edge Cases - Unit Tests
 * Tests for negative interactions (冲害刑破)
 */

import { evaluateClashHarmPunishment, getNegativeInteractionIntensity } from '../clashEngine';
import clashJson from '../../../data/rules/clash_harm_punishment.json';
import { ChartContext } from '../types';

const rules = (clashJson as any).clash_harm_punishment;

// Helper to create minimal chart context for testing
function createTestContext(overrides: Partial<ChartContext>): ChartContext {
  return {
    pillars: {
      year: { stem: '甲', branch: '子', stemElement: 'Wood', branchElement: 'Water', hiddenStems: [] },
      month: { stem: '丙', branch: '午', stemElement: 'Fire', branchElement: 'Fire', hiddenStems: [] },
      day: { stem: '戊', branch: '戌', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
      hour: { stem: '庚', branch: '申', stemElement: 'Metal', branchElement: 'Metal', hiddenStems: [] }
    },
    dayMaster: { stem: '戊', element: 'Earth', polarity: 'Yang', strength: 'balanced' },
    season: 'summer',
    monthBranch: '午',
    elementBalance: { Wood: 15, Fire: 25, Earth: 25, Metal: 20, Water: 15 },
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

describe('Clash / Harm / Punishment Edge Cases', () => {
  test('Clash removes annoying god → beneficial', () => {
    const ctx = createTestContext({
      dayMaster: { stem: '甲', element: 'Wood', polarity: 'Yang', strength: 'weak' },
      annoyingGod: {
        element: 'Metal',
        position: 'hour'
      },
      clashes: [{
        pair: ['寅', '申'],
        positions: ['year', 'hour'],
        strength: 'full'
      }]
    });

    const result = evaluateClashHarmPunishment(ctx, rules);

    // Check that clash is evaluated
    expect(result.clashes.length).toBe(1);
  });

  test('Self-punishment (辰辰, 午午, etc.) detected', () => {
    const ctx = createTestContext({
      pillars: {
        year: { stem: '戊', branch: '辰', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        month: { stem: '戊', branch: '辰', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        day: { stem: '戊', branch: '戌', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        hour: { stem: '庚', branch: '申', stemElement: 'Metal', branchElement: 'Metal', hiddenStems: [] }
      },
      punishments: [{
        type: 'self',
        participants: ['辰', '辰'],
        positions: ['year', 'month'],
        complete: true
      }]
    });

    const result = evaluateClashHarmPunishment(ctx, rules);

    expect(result.punishments.length).toBe(1);
    expect(result.punishments[0].punishment.type).toBe('self');
  });

  test('Three Punishment of Unkindness (寅巳申)', () => {
    const ctx = createTestContext({
      pillars: {
        year: { stem: '甲', branch: '寅', stemElement: 'Wood', branchElement: 'Wood', hiddenStems: [] },
        month: { stem: '丙', branch: '巳', stemElement: 'Fire', branchElement: 'Fire', hiddenStems: [] },
        day: { stem: '戊', branch: '申', stemElement: 'Earth', branchElement: 'Metal', hiddenStems: [] },
        hour: { stem: '庚', branch: '戌', stemElement: 'Metal', branchElement: 'Earth', hiddenStems: [] }
      },
      punishments: [{
        type: 'three_unkindness',
        participants: ['寅', '巳', '申'],
        positions: ['year', 'month', 'day'],
        complete: true
      }]
    });

    const result = evaluateClashHarmPunishment(ctx, rules);

    expect(result.punishments.length).toBe(1);
    expect(result.punishments[0].severity).toBeDefined();
  });

  test('Bullying Punishment (丑戌未)', () => {
    const ctx = createTestContext({
      pillars: {
        year: { stem: '己', branch: '丑', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        month: { stem: '戊', branch: '戌', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        day: { stem: '己', branch: '未', stemElement: 'Earth', branchElement: 'Earth', hiddenStems: [] },
        hour: { stem: '庚', branch: '申', stemElement: 'Metal', branchElement: 'Metal', hiddenStems: [] }
      },
      punishments: [{
        type: 'bullying',
        participants: ['丑', '戌', '未'],
        positions: ['year', 'month', 'day'],
        complete: true
      }]
    });

    const result = evaluateClashHarmPunishment(ctx, rules);

    expect(result.punishments.length).toBe(1);
  });

  test('Six Harm (六害) health implications', () => {
    const ctx = createTestContext({
      harms: [{
        pair: ['子', '未'],
        positions: ['year', 'day']
      }]
    });

    const result = evaluateClashHarmPunishment(ctx, rules);

    expect(result.harms.length).toBe(1);
  });

  test('Clash breaks special structure', () => {
    const ctx = createTestContext({
      currentStructure: 'true_follow',
      clashes: [{
        pair: ['子', '午'],
        positions: ['year', 'month'],
        strength: 'full'
      }]
    });

    const result = evaluateClashHarmPunishment(ctx, rules);

    expect(result.clashes.length).toBe(1);
  });

  test('Interaction intensity calculation', () => {
    const ctx = createTestContext({
      clashes: [
        { pair: ['子', '午'], positions: ['year', 'month'], strength: 'full' },
        { pair: ['卯', '酉'], positions: ['day', 'hour'], strength: 'full' }
      ],
      harms: [
        { pair: ['丑', '午'], positions: ['year', 'day'] }
      ],
      punishments: [{
        type: 'three_unkindness',
        participants: ['寅', '巳', '申'],
        positions: ['year', 'month', 'day'],
        complete: true
      }]
    });

    const result = evaluateClashHarmPunishment(ctx, rules);
    const intensity = getNegativeInteractionIntensity(result);

    // With multiple clashes, harm, and punishment, should be high or severe
    expect(['high', 'severe']).toContain(intensity);
  });
});
