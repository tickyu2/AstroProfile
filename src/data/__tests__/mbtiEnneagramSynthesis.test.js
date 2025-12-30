/**
 * Tests for MBTI + Enneagram Synthesis Engine
 * Phase 1 verification tests
 */

import {
  getSynthesis,
  getLunaGuidance,
  getStrengths,
  getChallenges,
  getGrowthPath,
  getFamousExamples,
  getRelationshipStyle,
  getCareerFits,
  isImplemented,
  getImplementedCombinations,
  getImplementationStats
} from '../mbtiEnneagramSynthesis';

describe('MBTI Enneagram Synthesis', () => {

  describe('getSynthesis', () => {
    test('returns null for invalid MBTI', () => {
      const result = getSynthesis('INVALID', 4);
      expect(result).toBeNull();
    });

    test('returns null for missing parameters', () => {
      expect(getSynthesis(null, 4)).toBeNull();
      expect(getSynthesis('INFP', null)).toBeNull();
      expect(getSynthesis(undefined, undefined)).toBeNull();
    });

    test('returns fallback for unimplemented combination', () => {
      const result = getSynthesis('INFP', 8);
      expect(result).toBeDefined();
      expect(result.implemented).toBe(false);
      expect(result.archetype).toBe('INFP + Type 8');
    });

    test('returns full synthesis for INFP + Type 4', () => {
      const result = getSynthesis('INFP', 4);
      expect(result).toBeDefined();
      expect(result.implemented).toBe(true);
      expect(result.archetype).toBe('The Artistic Soul');
      expect(result.strengths.length).toBe(6);
      expect(result.challenges.length).toBe(6);
    });

    test('returns full synthesis for INTJ + Type 5', () => {
      const result = getSynthesis('INTJ', 5);
      expect(result).toBeDefined();
      expect(result.implemented).toBe(true);
      expect(result.archetype).toBe('The Strategic Observer');
    });

    test('handles lowercase MBTI', () => {
      const result = getSynthesis('infp', 4);
      expect(result).toBeDefined();
      expect(result.implemented).toBe(true);
      expect(result.archetype).toBe('The Artistic Soul');
    });
  });

  describe('getLunaGuidance', () => {
    test('returns Luna guidance for implemented combination', () => {
      const guidance = getLunaGuidance('INFP', 4);
      expect(guidance).toBeDefined();
      expect(guidance.communication_style).toBe('Deep, poetic, validating');
      expect(guidance.what_to_do.length).toBeGreaterThan(0);
      expect(guidance.what_to_avoid.length).toBeGreaterThan(0);
    });

    test('returns null for unimplemented combination', () => {
      const guidance = getLunaGuidance('INFP', 8);
      expect(guidance).toBeNull();
    });
  });

  describe('getStrengths', () => {
    test('returns strengths array for INFP + 4', () => {
      const strengths = getStrengths('INFP', 4);
      expect(strengths.length).toBe(6);
      expect(strengths[0]).toBe('Profoundly authentic and genuine');
    });

    test('returns empty array for unimplemented', () => {
      const strengths = getStrengths('INFP', 8);
      expect(strengths).toEqual([]);
    });
  });

  describe('getChallenges', () => {
    test('returns challenges array for INTJ + 5', () => {
      const challenges = getChallenges('INTJ', 5);
      expect(challenges.length).toBe(6);
    });

    test('returns empty array for unimplemented', () => {
      const challenges = getChallenges('ENFP', 7);
      expect(challenges).toEqual([]);
    });
  });

  describe('getGrowthPath', () => {
    test('returns growth path for INFP + 4', () => {
      const growth = getGrowthPath('INFP', 4);
      expect(growth).toBeDefined();
      expect(growth.integration).toContain('Type 1');
      expect(growth.avoid).toContain('Type 2');
    });
  });

  describe('getFamousExamples', () => {
    test('returns famous examples for INTJ + 5', () => {
      const examples = getFamousExamples('INTJ', 5);
      expect(examples.length).toBe(4);
      expect(examples[0].name).toBe('Elon Musk');
    });
  });

  describe('getRelationshipStyle', () => {
    test('returns relationship style for INFP + 4', () => {
      const style = getRelationshipStyle('INFP', 4);
      expect(style).toBeDefined();
      expect(style.best_matches).toContain('ENFJ');
    });
  });

  describe('getCareerFits', () => {
    test('returns career fits for INTJ + 5', () => {
      const careers = getCareerFits('INTJ', 5);
      expect(careers).toBeDefined();
      expect(careers.best.length).toBeGreaterThan(0);
      expect(careers.best).toContain('Software Architect/Engineer');
    });
  });

  describe('isImplemented', () => {
    test('returns true for INFP + 4', () => {
      expect(isImplemented('INFP', 4)).toBe(true);
    });

    test('returns true for INTJ + 5', () => {
      expect(isImplemented('INTJ', 5)).toBe(true);
    });

    test('returns false for unimplemented', () => {
      expect(isImplemented('ENFP', 7)).toBe(false);
      expect(isImplemented('INFP', 8)).toBe(false);
    });
  });

  describe('getImplementedCombinations', () => {
    test('returns array of implemented combinations', () => {
      const combinations = getImplementedCombinations();
      expect(Array.isArray(combinations)).toBe(true);
      expect(combinations.length).toBe(2); // INFP+4 and INTJ+5

      const infp4 = combinations.find(c => c.mbti === 'INFP' && c.enneagram === 4);
      expect(infp4).toBeDefined();
      expect(infp4.archetype).toBe('The Artistic Soul');

      const intj5 = combinations.find(c => c.mbti === 'INTJ' && c.enneagram === 5);
      expect(intj5).toBeDefined();
      expect(intj5.archetype).toBe('The Strategic Observer');
    });
  });

  describe('getImplementationStats', () => {
    test('returns correct statistics', () => {
      const stats = getImplementationStats();
      expect(stats.implemented).toBe(2);
      expect(stats.priority1Total).toBe(36);
      expect(stats.totalPossible).toBe(144);
      expect(stats.priority1Progress).toBe('2/36');
      expect(stats.combinations.length).toBe(2);
    });
  });
});
