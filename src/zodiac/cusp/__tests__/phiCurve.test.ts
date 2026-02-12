import {
  PHI,
  PHI_CURVE_VALUES,
  DEFAULT_PHI,
  phiBlendFraction,
  phiBlendFractionWeighted,
  phiBlendInverse,
  computeCuspBlend,
  normalizeBlend,
  isCuspBlend,
  getPrimaryFromBlend,
  formatBlend,
  formatBlendPercent,
  generateBlendTable,
} from '../phiCurve';

// =============================================================================
// CONSTANTS
// =============================================================================

describe('PHI constant', () => {
  it('equals the golden ratio', () => {
    expect(PHI).toBeCloseTo(1.618033988749895, 10);
  });

  it('satisfies φ² = φ + 1', () => {
    expect(PHI * PHI).toBeCloseTo(PHI + 1, 10);
  });
});

describe('PHI_CURVE_VALUES', () => {
  it('pre-computed values match phiBlendFraction(1..7)', () => {
    const expected = [
      PHI_CURVE_VALUES.day1,
      PHI_CURVE_VALUES.day2,
      PHI_CURVE_VALUES.day3,
      PHI_CURVE_VALUES.day4,
      PHI_CURVE_VALUES.day5,
      PHI_CURVE_VALUES.day6,
      PHI_CURVE_VALUES.day7,
    ];
    for (let d = 1; d <= 7; d++) {
      expect(phiBlendFraction(d)).toBeCloseTo(expected[d - 1], 2);
    }
  });
});

// =============================================================================
// phiBlendFraction
// =============================================================================

describe('phiBlendFraction', () => {
  it('returns 0 at day 0', () => {
    expect(phiBlendFraction(0)).toBe(0);
  });

  it('returns 1 at cuspDays (day 7)', () => {
    expect(phiBlendFraction(7)).toBe(1);
  });

  it('is monotonically increasing from day 0 to 7', () => {
    let prev = -1;
    for (let d = 0; d <= 7; d++) {
      const val = phiBlendFraction(d);
      expect(val).toBeGreaterThanOrEqual(prev);
      prev = val;
    }
  });

  it('clamps negative days to 0', () => {
    expect(phiBlendFraction(-5)).toBe(0);
  });

  it('clamps days above cuspDays to 1', () => {
    expect(phiBlendFraction(10)).toBe(1);
  });

  it('mid-range values are between 0 and 1', () => {
    for (let d = 1; d < 7; d++) {
      const val = phiBlendFraction(d);
      expect(val).toBeGreaterThan(0);
      expect(val).toBeLessThan(1);
    }
  });
});

// =============================================================================
// phiBlendFractionWeighted
// =============================================================================

describe('phiBlendFractionWeighted', () => {
  it('amplifies equinox signs by 1.25x', () => {
    const base = phiBlendFraction(3);
    const weighted = phiBlendFractionWeighted(3, 'Aries');
    expect(weighted).toBeCloseTo(base * 1.25, 5);
  });

  it('amplifies solstice signs by 1.15x', () => {
    const base = phiBlendFraction(3);
    const weighted = phiBlendFractionWeighted(3, 'Cancer');
    expect(weighted).toBeCloseTo(base * 1.15, 5);
  });

  it('no amplification for standard signs', () => {
    const base = phiBlendFraction(3);
    const weighted = phiBlendFractionWeighted(3, 'Taurus');
    expect(weighted).toBeCloseTo(base, 5);
  });

  it('caps at 1.0 even with amplification', () => {
    // Day 7 base = 1.0, 1.0 * 1.25 should still cap at 1.0
    expect(phiBlendFractionWeighted(7, 'Aries')).toBe(1);
  });
});

// =============================================================================
// phiBlendInverse
// =============================================================================

describe('phiBlendInverse', () => {
  it('inverse + fraction always equals 1', () => {
    for (let d = 0; d <= 7; d++) {
      expect(phiBlendInverse(d) + phiBlendFraction(d)).toBeCloseTo(1, 10);
    }
  });
});

// =============================================================================
// computeCuspBlend
// =============================================================================

describe('computeCuspBlend', () => {
  const params = {
    primary: 'Taurus' as const,
    previous: 'Aries' as const,
    next: 'Gemini' as const,
  };

  it('returns pure sign at daysFromIngress=0', () => {
    const blend = computeCuspBlend({ ...params, daysFromIngress: 0 });
    expect(blend).toHaveLength(1);
    expect(blend[0].sign).toBe('Taurus');
    expect(blend[0].weight).toBe(1);
  });

  it('blends with previous sign when early in sign (d=1)', () => {
    const blend = computeCuspBlend({ ...params, daysFromIngress: 1 });
    expect(blend).toHaveLength(2);
    // Previous sign should dominate at day 1 (neighbor = (7-1)/7)^φ ≈ 78%)
    const previous = blend.find(b => b.sign === 'Aries');
    const primary = blend.find(b => b.sign === 'Taurus');
    expect(previous).toBeDefined();
    expect(primary).toBeDefined();
    expect(previous!.weight).toBeCloseTo(0.78, 1);
    expect(primary!.weight).toBeCloseTo(0.22, 1);
  });

  it('blends with next sign when late in sign (d=-1)', () => {
    const blend = computeCuspBlend({ ...params, daysFromIngress: -1 });
    expect(blend).toHaveLength(2);
    const next = blend.find(b => b.sign === 'Gemini');
    const primary = blend.find(b => b.sign === 'Taurus');
    expect(next).toBeDefined();
    expect(primary).toBeDefined();
    expect(next!.weight).toBeCloseTo(0.78, 1);
    expect(primary!.weight).toBeCloseTo(0.22, 1);
  });

  it('symmetric: day 1 previous weight ≈ day -1 next weight', () => {
    const early = computeCuspBlend({ ...params, daysFromIngress: 1 });
    const late = computeCuspBlend({ ...params, daysFromIngress: -1 });
    const prevWeight = early.find(b => b.sign === 'Aries')!.weight;
    const nextWeight = late.find(b => b.sign === 'Gemini')!.weight;
    expect(prevWeight).toBeCloseTo(nextWeight, 5);
  });

  it('blend weights sum to 1', () => {
    for (const d of [-6, -3, -1, 0, 1, 3, 6]) {
      const blend = computeCuspBlend({ ...params, daysFromIngress: d });
      const sum = blend.reduce((acc, b) => acc + b.weight, 0);
      expect(sum).toBeCloseTo(1, 5);
    }
  });

  it('at day 6, previous sign influence is minimal (<5%)', () => {
    const blend = computeCuspBlend({ ...params, daysFromIngress: 6 });
    if (blend.length === 2) {
      const prev = blend.find(b => b.sign === 'Aries');
      expect(prev!.weight).toBeLessThan(0.05);
    } else {
      // May return pure sign if below threshold
      expect(blend).toHaveLength(1);
      expect(blend[0].sign).toBe('Taurus');
    }
  });
});

// =============================================================================
// BLEND UTILITIES
// =============================================================================

describe('normalizeBlend', () => {
  it('normalizes weights to sum to 1', () => {
    const blend = normalizeBlend([
      { sign: 'Aries', weight: 3 },
      { sign: 'Taurus', weight: 7 },
    ]);
    expect(blend[0].weight).toBeCloseTo(0.3, 5);
    expect(blend[1].weight).toBeCloseTo(0.7, 5);
  });

  it('handles already-normalized blend', () => {
    const blend = normalizeBlend([
      { sign: 'Leo', weight: 0.6 },
      { sign: 'Cancer', weight: 0.4 },
    ]);
    expect(blend[0].weight + blend[1].weight).toBeCloseTo(1, 5);
  });
});

describe('isCuspBlend', () => {
  it('returns true when secondary weight >= 5%', () => {
    expect(isCuspBlend([
      { sign: 'Aries', weight: 0.9 },
      { sign: 'Pisces', weight: 0.1 },
    ])).toBe(true);
  });

  it('returns false when secondary weight < 5%', () => {
    expect(isCuspBlend([
      { sign: 'Aries', weight: 0.97 },
      { sign: 'Pisces', weight: 0.03 },
    ])).toBe(false);
  });

  it('returns false for pure sign (single entry)', () => {
    expect(isCuspBlend([{ sign: 'Taurus', weight: 1 }])).toBe(false);
  });
});

describe('getPrimaryFromBlend', () => {
  it('returns the sign with highest weight', () => {
    expect(getPrimaryFromBlend([
      { sign: 'Aries', weight: 0.3 },
      { sign: 'Taurus', weight: 0.7 },
    ])).toBe('Taurus');
  });

  it('throws on empty blend', () => {
    expect(() => getPrimaryFromBlend([])).toThrow('Empty blend');
  });
});

describe('formatBlendPercent', () => {
  it('converts weight to percentage', () => {
    expect(formatBlendPercent(0.75)).toBe(75);
    expect(formatBlendPercent(1)).toBe(100);
    expect(formatBlendPercent(0)).toBe(0);
  });
});

describe('formatBlend', () => {
  it('produces "Sign NN%, Sign NN%" format', () => {
    const result = formatBlend([
      { sign: 'Taurus', weight: 0.75 },
      { sign: 'Aries', weight: 0.25 },
    ]);
    expect(result).toBe('Taurus 75%, Aries 25%');
  });
});

// =============================================================================
// generateBlendTable
// =============================================================================

describe('generateBlendTable', () => {
  const table = generateBlendTable();

  it('returns 15 rows (day -7 to +7)', () => {
    expect(table).toHaveLength(15);
  });

  it('center row (day 0) is 100% primary, 0% blend', () => {
    const center = table.find(r => r.day === 0);
    expect(center).toBeDefined();
    expect(center!.primaryPercent).toBe(100);
    expect(center!.blendPercent).toBe(0);
    expect(center!.direction).toBe('center');
  });

  it('all rows sum primary + blend to 100', () => {
    for (const row of table) {
      expect(row.primaryPercent + row.blendPercent).toBe(100);
    }
  });

  it('positive days have backward direction', () => {
    for (const row of table.filter(r => r.day > 0)) {
      expect(row.direction).toBe('backward');
    }
  });

  it('negative days have forward direction', () => {
    for (const row of table.filter(r => r.day < 0)) {
      expect(row.direction).toBe('forward');
    }
  });

  it('blend percentage decreases as |day| increases (moving away from boundary)', () => {
    // Positive side: day 1 should have highest blend, day 6 lowest
    const positiveSide = table.filter(r => r.day > 0).sort((a, b) => a.day - b.day);
    for (let i = 1; i < positiveSide.length; i++) {
      expect(positiveSide[i].blendPercent).toBeLessThanOrEqual(positiveSide[i - 1].blendPercent);
    }
  });
});
