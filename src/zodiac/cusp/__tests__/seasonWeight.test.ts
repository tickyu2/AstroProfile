import {
  seasonAmplifier,
  getSeasonAmplifierExplanation,
  classifyCusp,
  getCuspTypeLabel,
  isCardinalSign,
  SEASON_OPENERS,
} from '../seasonWeight';
import type { ZodiacSign } from '../../../data/tropicalSeasons';

const ALL_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// =============================================================================
// seasonAmplifier
// =============================================================================

describe('seasonAmplifier', () => {
  it('Aries = 1.25 (equinox)', () => {
    expect(seasonAmplifier('Aries')).toBe(1.25);
  });

  it('Libra = 1.25 (equinox)', () => {
    expect(seasonAmplifier('Libra')).toBe(1.25);
  });

  it('Cancer = 1.15 (solstice)', () => {
    expect(seasonAmplifier('Cancer')).toBe(1.15);
  });

  it('Capricorn = 1.15 (solstice)', () => {
    expect(seasonAmplifier('Capricorn')).toBe(1.15);
  });

  it('all other signs = 1.0', () => {
    const standardSigns: ZodiacSign[] = [
      'Taurus', 'Gemini', 'Leo', 'Virgo', 'Scorpio', 'Sagittarius', 'Aquarius', 'Pisces',
    ];
    for (const sign of standardSigns) {
      expect(seasonAmplifier(sign)).toBe(1.0);
    }
  });
});

// =============================================================================
// classifyCusp
// =============================================================================

describe('classifyCusp', () => {
  it('equinox for Aries and Libra', () => {
    expect(classifyCusp('Aries')).toBe('equinox');
    expect(classifyCusp('Libra')).toBe('equinox');
  });

  it('solstice for Cancer and Capricorn', () => {
    expect(classifyCusp('Cancer')).toBe('solstice');
    expect(classifyCusp('Capricorn')).toBe('solstice');
  });

  it('standard for all others', () => {
    const standard: ZodiacSign[] = [
      'Taurus', 'Gemini', 'Leo', 'Virgo', 'Scorpio', 'Sagittarius', 'Aquarius', 'Pisces',
    ];
    for (const sign of standard) {
      expect(classifyCusp(sign)).toBe('standard');
    }
  });
});

// =============================================================================
// getCuspTypeLabel
// =============================================================================

describe('getCuspTypeLabel', () => {
  it('returns correct labels', () => {
    expect(getCuspTypeLabel('equinox')).toBe('Equinox Cusp');
    expect(getCuspTypeLabel('solstice')).toBe('Solstice Cusp');
    expect(getCuspTypeLabel('standard')).toBe('Seasonal Cusp');
  });
});

// =============================================================================
// isCardinalSign
// =============================================================================

describe('isCardinalSign', () => {
  it('true for 4 cardinal signs', () => {
    expect(isCardinalSign('Aries')).toBe(true);
    expect(isCardinalSign('Cancer')).toBe(true);
    expect(isCardinalSign('Libra')).toBe(true);
    expect(isCardinalSign('Capricorn')).toBe(true);
  });

  it('false for 8 non-cardinal signs', () => {
    const nonCardinal: ZodiacSign[] = [
      'Taurus', 'Gemini', 'Leo', 'Virgo', 'Scorpio', 'Sagittarius', 'Aquarius', 'Pisces',
    ];
    for (const sign of nonCardinal) {
      expect(isCardinalSign(sign)).toBe(false);
    }
  });
});

// =============================================================================
// getSeasonAmplifierExplanation
// =============================================================================

describe('getSeasonAmplifierExplanation', () => {
  it('returns non-null for 4 cardinal signs', () => {
    for (const sign of ['Aries', 'Cancer', 'Libra', 'Capricorn'] as ZodiacSign[]) {
      expect(getSeasonAmplifierExplanation(sign)).not.toBeNull();
      expect(typeof getSeasonAmplifierExplanation(sign)).toBe('string');
    }
  });

  it('returns null for non-cardinal signs', () => {
    expect(getSeasonAmplifierExplanation('Taurus')).toBeNull();
    expect(getSeasonAmplifierExplanation('Leo')).toBeNull();
    expect(getSeasonAmplifierExplanation('Pisces')).toBeNull();
  });
});

// =============================================================================
// SEASON_OPENERS
// =============================================================================

describe('SEASON_OPENERS', () => {
  it('maps each season to its cardinal sign', () => {
    expect(SEASON_OPENERS.Spring).toBe('Aries');
    expect(SEASON_OPENERS.Summer).toBe('Cancer');
    expect(SEASON_OPENERS.Autumn).toBe('Libra');
    expect(SEASON_OPENERS.Winter).toBe('Capricorn');
  });
});
