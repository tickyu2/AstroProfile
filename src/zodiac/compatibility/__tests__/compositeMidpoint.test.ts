import { buildCompositeMidpoint } from '../compositeMidpoint';

// =============================================================================
// buildCompositeMidpoint
// =============================================================================

describe('buildCompositeMidpoint', () => {
  it('method is always Midpoint', () => {
    const result = buildCompositeMidpoint({ Sun: 10 }, { Sun: 50 });
    expect(result.method).toBe('Midpoint');
  });

  it('same longitude → midpoint at same longitude', () => {
    const result = buildCompositeMidpoint({ Sun: 45 }, { Sun: 45 });
    expect(result.points).toHaveLength(1);
    expect(result.points[0].longitude).toBe(45);
    expect(result.points[0].sign).toBe('Taurus');
  });

  it('simple average: 10° and 50° → midpoint at 30°', () => {
    const result = buildCompositeMidpoint({ Sun: 10 }, { Sun: 50 });
    expect(result.points[0].longitude).toBe(30);
    expect(result.points[0].sign).toBe('Taurus');
    expect(result.points[0].degree).toBe(0);
  });

  it('shorter arc: 350° and 10° → midpoint at 0° (not 180°)', () => {
    const result = buildCompositeMidpoint({ Sun: 350 }, { Sun: 10 });
    expect(result.points[0].longitude).toBe(0);
  });

  it('shorter arc: 5° and 355° → midpoint at 0°', () => {
    const result = buildCompositeMidpoint({ Sun: 5 }, { Sun: 355 });
    expect(result.points[0].longitude).toBe(0);
  });

  it('only shared planets appear in output', () => {
    const result = buildCompositeMidpoint(
      { Sun: 10, Mars: 90 },
      { Sun: 50, Venus: 120 },
    );
    expect(result.points).toHaveLength(1);
    expect(result.points[0].name).toBe('Sun');
  });

  it('all 10 planets included when both charts have them', () => {
    const planetsA: Record<string, number> = {};
    const planetsB: Record<string, number> = {};
    const names = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
    for (let i = 0; i < names.length; i++) {
      planetsA[names[i]] = i * 30;
      planetsB[names[i]] = i * 30 + 15;
    }
    const result = buildCompositeMidpoint(planetsA, planetsB);
    expect(result.points).toHaveLength(10);
    expect(result.points.map(p => p.name)).toEqual(names);
  });

  it('output has correct sign and degree for composite point', () => {
    // Sun at 45° (Taurus 15°) and 75° (Gemini 15°) → midpoint 60° (Gemini 0°)
    const result = buildCompositeMidpoint({ Sun: 45 }, { Sun: 75 });
    expect(result.points[0].longitude).toBe(60);
    expect(result.points[0].sign).toBe('Gemini');
    expect(result.points[0].degree).toBe(0);
  });

  it('output has planet icons', () => {
    const result = buildCompositeMidpoint({ Sun: 10, Moon: 100 }, { Sun: 20, Moon: 110 });
    for (const point of result.points) {
      expect(point.icon).toBeDefined();
      expect(point.icon.length).toBeGreaterThan(0);
    }
  });

  it('handles opposite points (180° apart) correctly', () => {
    // 0° and 180° → could be either 90° or 270° (both are valid midpoints)
    const result = buildCompositeMidpoint({ Sun: 0 }, { Sun: 180 });
    // midpoint = (0+180)/2 = 90, and since |0-180| = 180 (not > 180), no flip
    expect(result.points[0].longitude).toBe(90);
  });
});
