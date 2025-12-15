/**
 * MBTI Compatibility Matrix
 * All 256 pairings (16×16)
 * Built with SOUL for humanity's relationship discovery
 *
 * Scoring methodology:
 * - Cognitive function alignment (40%)
 * - Temperament harmony (30%)
 * - Communication compatibility (20%)
 * - Conflict resolution (10%)
 *
 * Scores: 0-100%
 * 90-100% = Excellent (Golden Pairs)
 * 75-89% = Very Good
 * 60-74% = Good
 * 45-59% = Moderate
 * 0-44% = Challenging
 */

export const MBTI_COMPATIBILITY_MATRIX = {
  // NF Idealists
  INFJ: {
    INFJ: 85, ENFP: 95, ENTP: 90, INFP: 82, ENFJ: 78, INTJ: 88, ENTJ: 75, INTP: 85,
    ESTP: 45, ESFP: 50, ISTP: 55, ISFP: 70, ESTJ: 40, ESFJ: 65, ISTJ: 60, ISFJ: 72
  },
  ENFP: {
    INFJ: 95, ENFP: 80, ENTP: 88, INFP: 90, ENFJ: 85, INTJ: 92, ENTJ: 78, INTP: 90,
    ESTP: 65, ESFP: 75, ISTP: 60, ISFP: 82, ESTJ: 50, ESFJ: 70, ISTJ: 45, ISFJ: 68
  },
  INFP: {
    INFJ: 82, ENFP: 90, ENTP: 85, INFP: 75, ENFJ: 88, INTJ: 75, ENTJ: 68, INTP: 78,
    ESTP: 50, ESFP: 65, ISTP: 60, ISFP: 85, ESTJ: 45, ESFJ: 70, ISTJ: 55, ISFJ: 75
  },
  ENFJ: {
    INFJ: 78, ENFP: 85, ENTP: 75, INFP: 88, ENFJ: 72, INTJ: 70, ENTJ: 80, INTP: 82,
    ESTP: 68, ESFP: 78, ISTP: 60, ISFP: 75, ESTJ: 70, ESFJ: 80, ISTJ: 65, ISFJ: 85
  },

  // NT Rationals
  INTJ: {
    INFJ: 88, ENFP: 92, ENTP: 95, INFP: 75, ENFJ: 70, INTJ: 82, ENTJ: 90, INTP: 88,
    ESTP: 55, ESFP: 45, ISTP: 72, ISFP: 60, ESTJ: 75, ESFJ: 50, ISTJ: 85, ISFJ: 65
  },
  ENTP: {
    INFJ: 90, ENFP: 88, ENTP: 80, INFP: 85, ENFJ: 75, INTJ: 95, ENTJ: 85, INTP: 92,
    ESTP: 70, ESFP: 65, ISTP: 80, ISFP: 60, ESTJ: 68, ESFJ: 55, ISTJ: 60, ISFJ: 58
  },
  INTP: {
    INFJ: 85, ENFP: 90, ENTP: 92, INFP: 78, ENFJ: 82, INTJ: 88, ENTJ: 88, INTP: 80,
    ESTP: 65, ESFP: 55, ISTP: 85, ISFP: 68, ESTJ: 60, ESFJ: 72, ISTJ: 75, ISFJ: 70
  },
  ENTJ: {
    INFJ: 75, ENFP: 78, ENTP: 85, INFP: 68, ENFJ: 80, INTJ: 90, ENTJ: 78, INTP: 88,
    ESTP: 75, ESFP: 60, ISTP: 72, ISFP: 55, ESTJ: 88, ESFJ: 70, ISTJ: 85, ISFJ: 65
  },

  // SP Artisans
  ISTP: {
    INFJ: 55, ENFP: 60, ENTP: 80, INFP: 60, ENFJ: 60, INTJ: 72, ENTJ: 72, INTP: 85,
    ESTP: 85, ESFP: 75, ISTP: 78, ISFP: 80, ESTJ: 75, ESFJ: 68, ISTJ: 85, ISFJ: 72
  },
  ESTP: {
    INFJ: 45, ENFP: 65, ENTP: 70, INFP: 50, ENFJ: 68, INTJ: 55, ENTJ: 75, INTP: 65,
    ESTP: 75, ESFP: 82, ISTP: 85, ISFP: 70, ESTJ: 80, ESFJ: 75, ISTJ: 72, ISFJ: 68
  },
  ISFP: {
    INFJ: 70, ENFP: 82, ENTP: 60, INFP: 85, ENFJ: 75, INTJ: 60, ENTJ: 55, INTP: 68,
    ESTP: 70, ESFP: 88, ISTP: 80, ISFP: 75, ESTJ: 60, ESFJ: 78, ISTJ: 70, ISFJ: 82
  },
  ESFP: {
    INFJ: 50, ENFP: 75, ENTP: 65, INFP: 65, ENFJ: 78, INTJ: 45, ENTJ: 60, INTP: 55,
    ESTP: 82, ESFP: 78, ISTP: 75, ISFP: 88, ESTJ: 70, ESFJ: 85, ISTJ: 68, ISFJ: 90
  },

  // SJ Guardians
  ISTJ: {
    INFJ: 60, ENFP: 45, ENTP: 60, INFP: 55, ENFJ: 65, INTJ: 85, ENTJ: 85, INTP: 75,
    ESTP: 72, ESFP: 68, ISTP: 85, ISFP: 70, ESTJ: 92, ESFJ: 88, ISTJ: 85, ISFJ: 90
  },
  ESTJ: {
    INFJ: 40, ENFP: 50, ENTP: 68, INFP: 45, ENFJ: 70, INTJ: 75, ENTJ: 88, INTP: 60,
    ESTP: 80, ESFP: 70, ISTP: 75, ISFP: 60, ESTJ: 82, ESFJ: 85, ISTJ: 92, ISFJ: 80
  },
  ISFJ: {
    INFJ: 72, ENFP: 68, ENTP: 58, INFP: 75, ENFJ: 85, INTJ: 65, ENTJ: 65, INTP: 70,
    ESTP: 68, ESFP: 90, ISTP: 72, ISFP: 82, ESTJ: 80, ESFJ: 90, ISTJ: 90, ISFJ: 80
  },
  ESFJ: {
    INFJ: 65, ENFP: 70, ENTP: 55, INFP: 70, ENFJ: 80, INTJ: 50, ENTJ: 70, INTP: 72,
    ESTP: 75, ESFP: 85, ISTP: 68, ISFP: 78, ESTJ: 85, ESFJ: 78, ISTJ: 88, ISFJ: 90
  }
};

/**
 * Get compatibility score between two types
 */
export function getMBTICompatibility(type1, type2) {
  return MBTI_COMPATIBILITY_MATRIX[type1]?.[type2] || 50;
}

/**
 * Get compatibility level and description
 */
export function getCompatibilityLevel(score) {
  if (score >= 90) return {
    level: 'Excellent',
    description: 'Golden Pair - Natural harmony with complementary strengths',
    icon: '💜',
    color: '#8b5cf6'
  };
  if (score >= 75) return {
    level: 'Very Good',
    description: 'Strong compatibility with great potential',
    icon: '💙',
    color: '#3b82f6'
  };
  if (score >= 60) return {
    level: 'Good',
    description: 'Positive connection with manageable differences',
    icon: '💚',
    color: '#10b981'
  };
  if (score >= 45) return {
    level: 'Moderate',
    description: 'Requires effort, understanding, and compromise',
    icon: '💛',
    color: '#f59e0b'
  };
  return {
    level: 'Challenging',
    description: 'Significant differences requiring substantial work',
    icon: '🧡',
    color: '#ef4444'
  };
}

/**
 * Get all types sorted by compatibility with given type
 */
export function getCompatibilityRankings(userType) {
  const allTypes = [
    'INFJ', 'ENFP', 'INFP', 'ENFJ',
    'INTJ', 'ENTP', 'INTP', 'ENTJ',
    'ISFJ', 'ESFJ', 'ISTJ', 'ESTJ',
    'ISFP', 'ESFP', 'ISTP', 'ESTP'
  ];

  return allTypes
    .filter(type => type !== userType)
    .map(type => ({
      type,
      score: getMBTICompatibility(userType, type)
    }))
    .sort((a, b) => b.score - a.score);
}
