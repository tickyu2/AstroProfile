import {
  elementRelation,
  elementScore,
  modalityRelation,
  modalityScore,
  seasonRelation,
  seasonScore,
  baseAspectScore,
  identifyCompatibilityPattern,
  getPatternRankBonus,
} from '../scoringPrimitives';

// =============================================================================
// ELEMENT RELATIONSHIPS
// =============================================================================

describe('elementRelation', () => {
  it('same element → neutral', () => {
    expect(elementRelation('Fire', 'Fire')).toBe('neutral');
    expect(elementRelation('Water', 'Water')).toBe('neutral');
    expect(elementRelation('Earth', 'Earth')).toBe('neutral');
    expect(elementRelation('Air', 'Air')).toBe('neutral');
  });

  it('Fire/Air → support', () => {
    expect(elementRelation('Fire', 'Air')).toBe('support');
    expect(elementRelation('Air', 'Fire')).toBe('support');
  });

  it('Earth/Water → support', () => {
    expect(elementRelation('Earth', 'Water')).toBe('support');
    expect(elementRelation('Water', 'Earth')).toBe('support');
  });

  it('Fire/Water → friction', () => {
    expect(elementRelation('Fire', 'Water')).toBe('friction');
    expect(elementRelation('Water', 'Fire')).toBe('friction');
  });

  it('Earth/Air → friction', () => {
    expect(elementRelation('Earth', 'Air')).toBe('friction');
    expect(elementRelation('Air', 'Earth')).toBe('friction');
  });

  it('cross-functional (Fire/Earth, Air/Water) → neutral', () => {
    expect(elementRelation('Fire', 'Earth')).toBe('neutral');
    expect(elementRelation('Earth', 'Fire')).toBe('neutral');
    expect(elementRelation('Air', 'Water')).toBe('neutral');
    expect(elementRelation('Water', 'Air')).toBe('neutral');
  });
});

describe('elementScore', () => {
  it('support → 0.85', () => {
    expect(elementScore('support')).toBe(0.85);
  });

  it('neutral → 0.65', () => {
    expect(elementScore('neutral')).toBe(0.65);
  });

  it('friction → 0.40', () => {
    expect(elementScore('friction')).toBe(0.40);
  });
});

// =============================================================================
// MODALITY RELATIONSHIPS
// =============================================================================

describe('modalityRelation', () => {
  it('same modality → friction', () => {
    expect(modalityRelation('Cardinal', 'Cardinal')).toBe('friction');
    expect(modalityRelation('Fixed', 'Fixed')).toBe('friction');
    expect(modalityRelation('Mutable', 'Mutable')).toBe('friction');
  });

  it('Cardinal/Mutable → support (most complementary)', () => {
    expect(modalityRelation('Cardinal', 'Mutable')).toBe('support');
    expect(modalityRelation('Mutable', 'Cardinal')).toBe('support');
  });

  it('other mixed → neutral', () => {
    expect(modalityRelation('Cardinal', 'Fixed')).toBe('neutral');
    expect(modalityRelation('Fixed', 'Mutable')).toBe('neutral');
  });
});

describe('modalityScore', () => {
  it('support → 0.85', () => {
    expect(modalityScore('support')).toBe(0.85);
  });

  it('neutral → 0.70', () => {
    expect(modalityScore('neutral')).toBe(0.70);
  });

  it('friction → 0.45', () => {
    expect(modalityScore('friction')).toBe(0.45);
  });
});

// =============================================================================
// SEASON RELATIONSHIPS
// =============================================================================

describe('seasonRelation', () => {
  it('same season → same', () => {
    expect(seasonRelation('Spring', 'Spring')).toBe('same');
  });

  it('opposite seasons → opposite', () => {
    expect(seasonRelation('Spring', 'Autumn')).toBe('opposite');
    expect(seasonRelation('Summer', 'Winter')).toBe('opposite');
    expect(seasonRelation('Autumn', 'Spring')).toBe('opposite');
    expect(seasonRelation('Winter', 'Summer')).toBe('opposite');
  });

  it('adjacent seasons → adjacent', () => {
    expect(seasonRelation('Spring', 'Summer')).toBe('adjacent');
    expect(seasonRelation('Summer', 'Autumn')).toBe('adjacent');
    expect(seasonRelation('Spring', 'Winter')).toBe('adjacent');
  });
});

describe('seasonScore', () => {
  it('same → 0.80', () => {
    expect(seasonScore('same')).toBe(0.80);
  });

  it('adjacent → 0.70', () => {
    expect(seasonScore('adjacent')).toBe(0.70);
  });

  it('opposite → 0.60', () => {
    expect(seasonScore('opposite')).toBe(0.60);
  });
});

// =============================================================================
// ASPECT SCORING
// =============================================================================

describe('baseAspectScore', () => {
  it('returns expected values for all aspect types', () => {
    expect(baseAspectScore('trine')).toBe(0.88);
    expect(baseAspectScore('sextile')).toBe(0.82);
    expect(baseAspectScore('conjunction')).toBe(0.78);
    expect(baseAspectScore('opposition')).toBe(0.76);
    expect(baseAspectScore('square')).toBe(0.70);
    expect(baseAspectScore('semi_sextile')).toBe(0.66);
    expect(baseAspectScore('quincunx')).toBe(0.62);
  });

  it('scores are ordered: trine > sextile > conjunction > opposition > square > semi_sextile > quincunx', () => {
    const ordered = ['trine', 'sextile', 'conjunction', 'opposition', 'square', 'semi_sextile', 'quincunx'] as const;
    for (let i = 1; i < ordered.length; i++) {
      expect(baseAspectScore(ordered[i - 1])).toBeGreaterThan(baseAspectScore(ordered[i]));
    }
  });

  it('all scores are between 0 and 1', () => {
    const aspects = ['trine', 'sextile', 'conjunction', 'opposition', 'square', 'semi_sextile', 'quincunx'] as const;
    for (const aspect of aspects) {
      const score = baseAspectScore(aspect);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    }
  });
});

// =============================================================================
// COMPATIBILITY PATTERNS
// =============================================================================

describe('identifyCompatibilityPattern', () => {
  it('opposition aspect → conscious_opposition', () => {
    expect(identifyCompatibilityPattern('Fire', 'Air', 'Cardinal', 'Cardinal', 'opposition'))
      .toBe('conscious_opposition');
  });

  it('Cardinal + Mutable → cardinal_mutable', () => {
    expect(identifyCompatibilityPattern('Fire', 'Air', 'Cardinal', 'Mutable', 'sextile'))
      .toBe('cardinal_mutable');
  });

  it('Fire + Earth (cross-functional) → cross_element_functional', () => {
    expect(identifyCompatibilityPattern('Fire', 'Earth', 'Fixed', 'Fixed', 'square'))
      .toBe('cross_element_functional');
  });

  it('Mutable + Mutable different elements → mutable_mutable', () => {
    expect(identifyCompatibilityPattern('Fire', 'Air', 'Mutable', 'Mutable', 'sextile'))
      .toBe('mutable_mutable');
  });

  it('Cardinal + Fixed → cardinal_fixed', () => {
    expect(identifyCompatibilityPattern('Fire', 'Fire', 'Cardinal', 'Fixed', 'trine'))
      .toBe('cardinal_fixed');
  });

  it('trine + same element → trine_same_element', () => {
    expect(identifyCompatibilityPattern('Fire', 'Fire', 'Fixed', 'Mutable', 'trine'))
      .toBe('trine_same_element');
  });

  it('returns null for unmatched combinations', () => {
    // Earth + Earth, Fixed + Mutable, sextile → no specific pattern
    expect(identifyCompatibilityPattern('Earth', 'Earth', 'Mutable', 'Mutable', 'sextile'))
      .toBeNull();
  });
});

describe('getPatternRankBonus', () => {
  it('conscious_opposition has highest bonus', () => {
    expect(getPatternRankBonus('conscious_opposition')).toBe(0.15);
  });

  it('fixed_fixed has negative bonus (penalty)', () => {
    expect(getPatternRankBonus('fixed_fixed')).toBe(-0.05);
  });

  it('null pattern → 0', () => {
    expect(getPatternRankBonus(null)).toBe(0);
  });

  it('bonuses are ordered by rank', () => {
    expect(getPatternRankBonus('conscious_opposition')).toBeGreaterThan(getPatternRankBonus('cardinal_mutable'));
    expect(getPatternRankBonus('cardinal_mutable')).toBeGreaterThan(getPatternRankBonus('cross_element_functional'));
    expect(getPatternRankBonus('cross_element_functional')).toBeGreaterThan(getPatternRankBonus('trine_same_element'));
    expect(getPatternRankBonus('trine_same_element')).toBeGreaterThan(getPatternRankBonus('fixed_fixed'));
  });
});
