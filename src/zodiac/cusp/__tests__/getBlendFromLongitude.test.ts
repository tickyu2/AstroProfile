import {
  normalizeDeg360,
  signIndexFromLongitude,
  signFromLongitude,
  degreesIntoSign,
  distanceToNearestBoundary,
  neighborSign,
  phiSecondaryWeight,
  getBlendFromLongitude,
  DEFAULT_BLEND_CONFIG,
} from '../getBlendFromLongitude';

// =============================================================================
// normalizeDeg360
// =============================================================================

describe('normalizeDeg360', () => {
  it('keeps 0 as 0', () => {
    expect(normalizeDeg360(0)).toBe(0);
  });

  it('normalizes 360 to 0', () => {
    expect(normalizeDeg360(360)).toBe(0);
  });

  it('normalizes 720 to 0', () => {
    expect(normalizeDeg360(720)).toBe(0);
  });

  it('normalizes -30 to 330', () => {
    expect(normalizeDeg360(-30)).toBe(330);
  });

  it('keeps values in [0, 360) unchanged', () => {
    expect(normalizeDeg360(45)).toBe(45);
    expect(normalizeDeg360(180)).toBe(180);
    expect(normalizeDeg360(359.9)).toBeCloseTo(359.9);
  });

  it('normalizes -360 to 0', () => {
    expect(normalizeDeg360(-360)).toBeCloseTo(0);
  });
});

// =============================================================================
// signIndexFromLongitude / signFromLongitude
// =============================================================================

describe('signFromLongitude', () => {
  it('0° = Aries', () => {
    expect(signFromLongitude(0)).toBe('Aries');
  });

  it('15° = Aries (mid-sign)', () => {
    expect(signFromLongitude(15)).toBe('Aries');
  });

  it('30° = Taurus', () => {
    expect(signFromLongitude(30)).toBe('Taurus');
  });

  it('45° = Taurus (mid-sign)', () => {
    expect(signFromLongitude(45)).toBe('Taurus');
  });

  it('90° = Cancer', () => {
    expect(signFromLongitude(90)).toBe('Cancer');
  });

  it('180° = Libra', () => {
    expect(signFromLongitude(180)).toBe('Libra');
  });

  it('359° = Pisces', () => {
    expect(signFromLongitude(359)).toBe('Pisces');
  });

  it('maps all 12 sign starts correctly', () => {
    const expected = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ];
    for (let i = 0; i < 12; i++) {
      expect(signFromLongitude(i * 30)).toBe(expected[i]);
    }
  });
});

describe('signIndexFromLongitude', () => {
  it('returns 0 for Aries range', () => {
    expect(signIndexFromLongitude(0)).toBe(0);
    expect(signIndexFromLongitude(29.9)).toBe(0);
  });

  it('returns 11 for Pisces range', () => {
    expect(signIndexFromLongitude(330)).toBe(11);
    expect(signIndexFromLongitude(359.9)).toBe(11);
  });
});

// =============================================================================
// degreesIntoSign
// =============================================================================

describe('degreesIntoSign', () => {
  it('returns degree within sign', () => {
    expect(degreesIntoSign(45)).toBe(15); // 45° mod 30 = 15
    expect(degreesIntoSign(0)).toBe(0);
    expect(degreesIntoSign(30)).toBe(0);
    expect(degreesIntoSign(29.9)).toBeCloseTo(29.9);
  });
});

// =============================================================================
// distanceToNearestBoundary
// =============================================================================

describe('distanceToNearestBoundary', () => {
  it('near start of Taurus (30.5°) → previous side, 0.5°', () => {
    const info = distanceToNearestBoundary(30.5);
    expect(info.side).toBe('previous');
    expect(info.distanceDeg).toBeCloseTo(0.5);
  });

  it('near end of Aries (29.5°) → next side, 0.5°', () => {
    const info = distanceToNearestBoundary(29.5);
    expect(info.side).toBe('next');
    expect(info.distanceDeg).toBeCloseTo(0.5);
  });

  it('mid-sign (45° = 15° into Taurus) → distance ~15°', () => {
    const info = distanceToNearestBoundary(45);
    expect(info.distanceDeg).toBe(15);
  });

  it('exactly at boundary (0°) → previous side, distance 0', () => {
    const info = distanceToNearestBoundary(0);
    expect(info.distanceDeg).toBe(0);
    expect(info.side).toBe('previous');
  });
});

// =============================================================================
// neighborSign
// =============================================================================

describe('neighborSign', () => {
  it('Aries previous = Pisces (wraps)', () => {
    expect(neighborSign(15, 'previous')).toBe('Pisces');
  });

  it('Pisces next = Aries (wraps)', () => {
    expect(neighborSign(345, 'next')).toBe('Aries');
  });

  it('Taurus previous = Aries', () => {
    expect(neighborSign(45, 'previous')).toBe('Aries');
  });

  it('Taurus next = Gemini', () => {
    expect(neighborSign(45, 'next')).toBe('Gemini');
  });
});

// =============================================================================
// phiSecondaryWeight
// =============================================================================

describe('phiSecondaryWeight', () => {
  it('at boundary (distance=0) → 0.5 (50/50)', () => {
    expect(phiSecondaryWeight(0, 5)).toBe(0.5);
  });

  it('at window edge (distance=windowDeg) → 0 (pure sign)', () => {
    expect(phiSecondaryWeight(5, 5)).toBe(0);
  });

  it('decreases as distance increases', () => {
    let prev = 1;
    for (let d = 0; d <= 5; d++) {
      const w = phiSecondaryWeight(d, 5);
      expect(w).toBeLessThanOrEqual(prev);
      prev = w;
    }
  });

  it('never exceeds 0.5', () => {
    for (let d = 0; d <= 10; d++) {
      expect(phiSecondaryWeight(d, 5)).toBeLessThanOrEqual(0.5);
    }
  });
});

// =============================================================================
// getBlendFromLongitude
// =============================================================================

describe('getBlendFromLongitude', () => {
  it('mid-sign returns pure sign', () => {
    const blend = getBlendFromLongitude(45); // 15° into Taurus
    expect(blend).toHaveLength(1);
    expect(blend[0].sign).toBe('Taurus');
    expect(blend[0].weight).toBe(1);
  });

  it('near Taurus ingress (30.01°) → Taurus/Aries blend', () => {
    const blend = getBlendFromLongitude(30.01);
    expect(blend).toHaveLength(2);
    expect(blend.map(b => b.sign)).toContain('Taurus');
    expect(blend.map(b => b.sign)).toContain('Aries');
  });

  it('near Aries exit (29.99°) → Aries/Taurus blend', () => {
    const blend = getBlendFromLongitude(29.99);
    expect(blend).toHaveLength(2);
    expect(blend.map(b => b.sign)).toContain('Aries');
    expect(blend.map(b => b.sign)).toContain('Taurus');
  });

  it('blend weights always sum to 1', () => {
    for (const lon of [0, 0.5, 15, 29.5, 30, 30.5, 45, 89, 90, 180, 270, 330, 359.5]) {
      const blend = getBlendFromLongitude(lon);
      const sum = blend.reduce((acc, b) => acc + b.weight, 0);
      expect(sum).toBeCloseTo(1, 5);
    }
  });

  it('wraps at 360°/0° boundary (Pisces/Aries)', () => {
    const blend = getBlendFromLongitude(359.5); // 29.5° into Pisces → near Aries
    expect(blend).toHaveLength(2);
    expect(blend.map(b => b.sign)).toContain('Pisces');
    expect(blend.map(b => b.sign)).toContain('Aries');
  });

  it('Pisces ingress blend (330.5°)', () => {
    const blend = getBlendFromLongitude(330.5); // 0.5° into Pisces → Aquarius fading
    expect(blend).toHaveLength(2);
    expect(blend.map(b => b.sign)).toContain('Pisces');
    expect(blend.map(b => b.sign)).toContain('Aquarius');
  });

  it('primary sign always has the highest weight', () => {
    for (const lon of [0.5, 30.5, 59.5, 90.5, 120.5, 150.5]) {
      const blend = getBlendFromLongitude(lon);
      if (blend.length === 2) {
        expect(blend[0].weight).toBeGreaterThanOrEqual(blend[1].weight);
      }
    }
  });
});
