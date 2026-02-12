import {
  elementPairType,
  elementScore01,
  elementLabel,
  modalityPairType,
  modalityScore01,
  modalityLabel,
  seasonalPairType,
  seasonalScore01,
  seasonalLabel,
  getSeasonalPhase,
  combinedScore01,
  LAYER_WEIGHTS,
} from '../elementModality';

// =============================================================================
// ELEMENT SCORING
// =============================================================================

describe('elementPairType', () => {
  it('same element → same', () => {
    expect(elementPairType('Fire', 'Fire')).toBe('same');
    expect(elementPairType('Water', 'Water')).toBe('same');
  });

  it('Fire/Air → complementary', () => {
    expect(elementPairType('Fire', 'Air')).toBe('complementary');
    expect(elementPairType('Air', 'Fire')).toBe('complementary');
  });

  it('Earth/Water → complementary', () => {
    expect(elementPairType('Earth', 'Water')).toBe('complementary');
    expect(elementPairType('Water', 'Earth')).toBe('complementary');
  });

  it('Fire/Water → clashing', () => {
    expect(elementPairType('Fire', 'Water')).toBe('clashing');
    expect(elementPairType('Water', 'Fire')).toBe('clashing');
  });

  it('Earth/Air → clashing', () => {
    expect(elementPairType('Earth', 'Air')).toBe('clashing');
    expect(elementPairType('Air', 'Earth')).toBe('clashing');
  });

  it('Fire/Earth → neutral', () => {
    expect(elementPairType('Fire', 'Earth')).toBe('neutral');
    expect(elementPairType('Earth', 'Fire')).toBe('neutral');
  });

  it('Air/Water → neutral', () => {
    expect(elementPairType('Air', 'Water')).toBe('neutral');
    expect(elementPairType('Water', 'Air')).toBe('neutral');
  });
});

describe('elementScore01', () => {
  it('same element (Aries/Leo both Fire) → 0.90', () => {
    expect(elementScore01('Aries', 'Leo')).toBe(0.90);
  });

  it('complementary (Aries/Gemini: Fire/Air) → 0.82', () => {
    expect(elementScore01('Aries', 'Gemini')).toBe(0.82);
  });

  it('clashing (Aries/Cancer: Fire/Water) → 0.60', () => {
    expect(elementScore01('Aries', 'Cancer')).toBe(0.60);
  });

  it('neutral (Aries/Taurus: Fire/Earth) → 0.70', () => {
    expect(elementScore01('Aries', 'Taurus')).toBe(0.70);
  });

  it('is symmetric: A,B = B,A', () => {
    expect(elementScore01('Leo', 'Pisces')).toBe(elementScore01('Pisces', 'Leo'));
  });
});

describe('elementLabel', () => {
  it('returns correct labels for each pair type', () => {
    expect(elementLabel('Aries', 'Leo')).toBe('same language');
    expect(elementLabel('Aries', 'Gemini')).toBe('natural support');
    expect(elementLabel('Aries', 'Cancer')).toBe('friction');
    expect(elementLabel('Aries', 'Taurus')).toBe('workable');
  });
});

// =============================================================================
// MODALITY SCORING
// =============================================================================

describe('modalityPairType', () => {
  it('same modality → same', () => {
    expect(modalityPairType('Cardinal', 'Cardinal')).toBe('same');
    expect(modalityPairType('Fixed', 'Fixed')).toBe('same');
    expect(modalityPairType('Mutable', 'Mutable')).toBe('same');
  });

  it('Cardinal/Fixed → cardinal_fixed', () => {
    expect(modalityPairType('Cardinal', 'Fixed')).toBe('cardinal_fixed');
    expect(modalityPairType('Fixed', 'Cardinal')).toBe('cardinal_fixed');
  });

  it('Fixed/Mutable → fixed_mutable', () => {
    expect(modalityPairType('Fixed', 'Mutable')).toBe('fixed_mutable');
    expect(modalityPairType('Mutable', 'Fixed')).toBe('fixed_mutable');
  });

  it('Cardinal/Mutable → cardinal_mutable', () => {
    expect(modalityPairType('Cardinal', 'Mutable')).toBe('cardinal_mutable');
    expect(modalityPairType('Mutable', 'Cardinal')).toBe('cardinal_mutable');
  });
});

describe('modalityScore01', () => {
  it('same (Aries/Cancer both Cardinal) → 0.85', () => {
    expect(modalityScore01('Aries', 'Cancer')).toBe(0.85);
  });

  it('Cardinal/Fixed (Aries/Taurus) → 0.75', () => {
    expect(modalityScore01('Aries', 'Taurus')).toBe(0.75);
  });

  it('Fixed/Mutable (Taurus/Gemini) → 0.72', () => {
    expect(modalityScore01('Taurus', 'Gemini')).toBe(0.72);
  });

  it('Cardinal/Mutable (Aries/Gemini) → 0.65', () => {
    expect(modalityScore01('Aries', 'Gemini')).toBe(0.65);
  });

  it('is symmetric', () => {
    expect(modalityScore01('Aries', 'Taurus')).toBe(modalityScore01('Taurus', 'Aries'));
    expect(modalityScore01('Leo', 'Virgo')).toBe(modalityScore01('Virgo', 'Leo'));
  });
});

// =============================================================================
// SEASONAL SCORING
// =============================================================================

describe('getSeasonalPhase', () => {
  it('Cardinal → Begin', () => {
    expect(getSeasonalPhase('Aries')).toBe('Begin');
    expect(getSeasonalPhase('Cancer')).toBe('Begin');
    expect(getSeasonalPhase('Libra')).toBe('Begin');
    expect(getSeasonalPhase('Capricorn')).toBe('Begin');
  });

  it('Fixed → Core', () => {
    expect(getSeasonalPhase('Taurus')).toBe('Core');
    expect(getSeasonalPhase('Leo')).toBe('Core');
    expect(getSeasonalPhase('Scorpio')).toBe('Core');
    expect(getSeasonalPhase('Aquarius')).toBe('Core');
  });

  it('Mutable → End', () => {
    expect(getSeasonalPhase('Gemini')).toBe('End');
    expect(getSeasonalPhase('Virgo')).toBe('End');
    expect(getSeasonalPhase('Sagittarius')).toBe('End');
    expect(getSeasonalPhase('Pisces')).toBe('End');
  });
});

describe('seasonalPairType', () => {
  it('same phase → same', () => {
    expect(seasonalPairType('Begin', 'Begin')).toBe('same');
  });

  it('Begin/Core → begin_core', () => {
    expect(seasonalPairType('Begin', 'Core')).toBe('begin_core');
    expect(seasonalPairType('Core', 'Begin')).toBe('begin_core');
  });

  it('Core/End → core_end', () => {
    expect(seasonalPairType('Core', 'End')).toBe('core_end');
    expect(seasonalPairType('End', 'Core')).toBe('core_end');
  });

  it('Begin/End → begin_end', () => {
    expect(seasonalPairType('Begin', 'End')).toBe('begin_end');
    expect(seasonalPairType('End', 'Begin')).toBe('begin_end');
  });
});

describe('seasonalScore01', () => {
  it('same phase (Aries/Libra both Begin) → 0.85', () => {
    expect(seasonalScore01('Aries', 'Libra')).toBe(0.85);
  });

  it('Begin/Core (Aries/Taurus) → 0.75', () => {
    expect(seasonalScore01('Aries', 'Taurus')).toBe(0.75);
  });

  it('Core/End (Taurus/Gemini) → 0.72', () => {
    expect(seasonalScore01('Taurus', 'Gemini')).toBe(0.72);
  });

  it('Begin/End (Aries/Gemini) → 0.65', () => {
    expect(seasonalScore01('Aries', 'Gemini')).toBe(0.65);
  });

  it('is symmetric', () => {
    expect(seasonalScore01('Aries', 'Leo')).toBe(seasonalScore01('Leo', 'Aries'));
  });
});

// =============================================================================
// COMBINED SCORING
// =============================================================================

describe('LAYER_WEIGHTS', () => {
  it('sum to 1.0', () => {
    const sum = LAYER_WEIGHTS.aspect + LAYER_WEIGHTS.element + LAYER_WEIGHTS.modality + LAYER_WEIGHTS.seasonal;
    expect(sum).toBeCloseTo(1.0, 10);
  });
});

describe('combinedScore01', () => {
  it('all 1.0 → 1.0', () => {
    expect(combinedScore01(1, 1, 1, 1)).toBeCloseTo(1.0, 10);
  });

  it('all 0.0 → 0.0', () => {
    expect(combinedScore01(0, 0, 0, 0)).toBeCloseTo(0.0, 10);
  });

  it('applies weights correctly: 40% aspect + 25% element + 20% modality + 15% seasonal', () => {
    const result = combinedScore01(0.80, 0.90, 0.75, 0.85);
    const expected = 0.80 * 0.40 + 0.90 * 0.25 + 0.75 * 0.20 + 0.85 * 0.15;
    expect(result).toBeCloseTo(expected, 10);
  });

  it('defaults seasonal to 0.75 when omitted', () => {
    const withSeasonal = combinedScore01(0.80, 0.90, 0.75, 0.75);
    const withoutSeasonal = combinedScore01(0.80, 0.90, 0.75);
    expect(withSeasonal).toBeCloseTo(withoutSeasonal, 10);
  });
});
